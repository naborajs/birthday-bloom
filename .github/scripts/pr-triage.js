import fs from 'fs';
import path from 'path';

// 1. Validate Environment
const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error("Error: GITHUB_TOKEN environment variable is required.");
  process.exit(1);
}

const repository = process.env.GITHUB_REPOSITORY;
if (!repository) {
  console.error("Error: GITHUB_REPOSITORY environment variable is required.");
  process.exit(1);
}
const [owner, repo] = repository.split('/');

const eventPath = process.env.GITHUB_EVENT_PATH;
if (!eventPath) {
  console.error("Error: GITHUB_EVENT_PATH environment variable is required.");
  process.exit(1);
}

const event = JSON.parse(fs.readFileSync(eventPath, 'utf8'));

// 2. Load Configuration
const configPath = path.join(process.cwd(), '.github/automation.config.json');
if (!fs.existsSync(configPath)) {
  console.error(`Error: Configuration file not found at ${configPath}`);
  process.exit(1);
}
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// 3. Helper Functions
async function apiRequest(apiPath, method = 'GET', body = null) {
  const url = `https://api.github.com${apiPath}`;
  const options = {
    method,
    headers: {
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'PR-Triage-Agent',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  };
  if (body) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API request failed: ${method} ${apiPath} -> ${res.status} ${res.statusText}\nResponse: ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

function globToRegex(pattern) {
  let p = pattern;
  p = p.replace(/\*\*/g, '___GLOBSTAR___');
  p = p.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  p = p.replace(/\*/g, '[^/]*');
  p = p.replace(/___GLOBSTAR___/g, '.*');
  return new RegExp('^' + p + '$');
}

function matchGlob(filePath, pattern) {
  return globToRegex(pattern).test(filePath);
}

function getTurnaroundEstimate(complexity) {
  switch (complexity) {
    case 'pr-level:trivial': return "⚡ **5 - 15 minutes** (Trivial change)";
    case 'pr-level:beginner': return "⏰ **30 minutes - 1 hour** (Minor change)";
    case 'pr-level:intermediate': return "📅 **1 - 2 hours** (Standard review)";
    case 'pr-level:advanced': return "🔍 **1 - 2 days** (Thorough review)";
    case 'pr-level:major': return "🚨 **2 - 3 days** (Major architectural update)";
    default: return "📅 **Standard review time**";
  }
}

async function createCheckRun(headSha, name, status, conclusion, output) {
  await apiRequest(`/repos/${owner}/${repo}/check-runs`, 'POST', {
    name,
    head_sha: headSha,
    status,
    conclusion,
    output
  });
}

// 4. Main Triage Mode
async function runPRMode() {
  const pullNumber = event.pull_request?.number;
  if (!pullNumber) {
    console.log("Could not resolve pull request number. Exiting gracefully.");
    process.exit(0);
  }

  console.log(`Processing PR #${pullNumber} in ${owner}/${repo}...`);

  // A. Fetch current detailed PR info
  const pr = await apiRequest(`/repos/${owner}/${repo}/pulls/${pullNumber}`);
  const { additions = 0, deletions = 0, changed_files: changedFilesCount = 0, title = '', head: { sha: headSha }, draft, user: { login: author, type: authorType } } = pr;
  const totalLines = additions + deletions;

  // B. Check Exemptions
  const exemptions = config.exemptions || {};
  const exemptedUsers = exemptions.users || [];
  const exemptedRoles = exemptions.roles || [];
  let isExempt = authorType === 'Bot' || exemptedUsers.includes(author);

  if (!isExempt) {
    try {
      const { data: perm } = await github.rest.repos.getCollaboratorPermissionLevel({ owner, repo, username: author });
      if (exemptedRoles.includes(perm.permission)) isExempt = true;
    } catch (e) {}
  }

  // C. Fetch changed files
  let files = [];
  try {
    files = await apiRequest(`/repos/${owner}/${repo}/pulls/${pullNumber}/files?per_page=100`);
  } catch (error) {
    console.error("Failed to fetch changed files:", error);
  }
  const filePaths = files.map(f => f.filename);

  // D. Security & Quality Checks (Check Runs)
  let failedChecks = false;

  // 1. Spam Guard
  if (!isExempt) {
    const maxOpenPRs = config.prs?.maxOpen || 5;
    const prsList = await apiRequest(`/repos/${owner}/${repo}/pulls?state=open&per_page=100`);
    const authorOpenPRs = prsList.filter(p => p.user && p.user.login === author);
    if (authorOpenPRs.length > maxOpenPRs) {
      await createCheckRun(headSha, 'Spam Guard', 'completed', 'action_required', {
        title: 'PR Limit Exceeded',
        summary: `You currently have ${authorOpenPRs.length} open PRs. The maximum allowed is ${maxOpenPRs}. Please close or merge some before continuing.`
      });
      failedChecks = true;
    } else {
      await createCheckRun(headSha, 'Spam Guard', 'completed', 'success', { title: 'PR Limit OK', summary: 'You are within the PR limit.' });
    }
  }

  // 2. Forbidden Files & Lockfiles
  if (!isExempt) {
    let violations = [];
    const forbiddenPatterns = config.protections?.forbiddenPaths || [];
    for (const pattern of forbiddenPatterns) {
      const regex = new RegExp(pattern);
      const matched = filePaths.filter(f => regex.test(f));
      if (matched.length > 0) violations.push(`Forbidden paths modified: ${matched.join(', ')}`);
    }

    const lockfilePairs = config.protections?.lockfiles?.pairs || {};
    for (const [lock, source] of Object.entries(lockfilePairs)) {
      if (filePaths.includes(lock) && !filePaths.includes(source)) {
        violations.push(`Modified \`${lock}\` but did not modify \`${source}\`.`);
      }
    }

    if (violations.length > 0) {
      await createCheckRun(headSha, 'File Guard', 'completed', 'action_required', {
        title: 'Suspicious File Modifications',
        summary: `The following rules were violated:\n\n${violations.map(v => `- ${v}`).join('\n')}\n\nMaintainer review is required.`
      });
      failedChecks = true;
    } else {
      await createCheckRun(headSha, 'File Guard', 'completed', 'success', { title: 'File Checks Passed', summary: 'No forbidden or suspicious file changes detected.' });
    }
  }

  if (failedChecks) {
    // If checks failed, we can optionally apply a label to flag for maintainers
    try {
      await apiRequest(`/repos/${owner}/${repo}/issues/${pullNumber}/labels`, 'POST', { labels: ['status:action-required'] });
    } catch (e) {}
  }

  // E. Determine Labels to Apply
  const labelsToApply = [];

  // 1. PR Complexity Level
  const { trivial, beginner, intermediate, advanced } = config.complexityLevels;
  let detectedLevel = 'pr-level:major';
  if (totalLines < trivial.maxLines && changedFilesCount <= trivial.maxFiles) detectedLevel = 'pr-level:trivial';
  else if (totalLines < beginner.maxLines && changedFilesCount <= beginner.maxFiles) detectedLevel = 'pr-level:beginner';
  else if (totalLines <= intermediate.maxLines && changedFilesCount <= intermediate.maxFiles) detectedLevel = 'pr-level:intermediate';
  else if (totalLines <= advanced.maxLines && changedFilesCount <= advanced.maxFiles) detectedLevel = 'pr-level:advanced';
  labelsToApply.push(detectedLevel);

  // 2. PR Type
  let detectedType = null;
  const ccRegex = /^(\w+)(?:\(.+?\))?!\s*:\s*(.+)$|^(\w+)(?:\(.+?\))?\s*:\s*(.+)$/;
  const titleMatch = title.match(ccRegex);
  if (titleMatch) {
    const rawType = (titleMatch[1] || titleMatch[3]).toLowerCase();
    for (const [typeName, prefixes] of Object.entries(config.typeMapping)) {
      if (prefixes.includes(rawType)) { detectedType = typeName; break; }
    }
  }

  if (!detectedType) {
    let maxScore = 0;
    for (const [typeName, patterns] of Object.entries(config.typePathHeuristics)) {
      let score = 0;
      for (const pattern of patterns) {
        for (const filePath of filePaths) {
          if (matchGlob(filePath, pattern)) score++;
        }
      }
      if (score > maxScore) { maxScore = score; detectedType = typeName; }
    }
  }
  if (detectedType) labelsToApply.push(detectedType);

  // 3. PR Areas
  const detectedAreas = [];
  for (const [areaName, patterns] of Object.entries(config.areaMapping)) {
    let matched = false;
    for (const pattern of patterns) {
      for (const filePath of filePaths) {
        if (matchGlob(filePath, pattern)) { matched = true; break; }
      }
      if (matched) break;
    }
    if (matched) { detectedAreas.push(areaName); labelsToApply.push(areaName); }
  }

  // 4. Contributor Status
  let contributorStatus = 'first-time-contributor';
  try {
    const searchResult = await apiRequest(`/search/issues?q=is:pr+is:merged+author:${author}+repo:${owner}/${repo}`);
    if (searchResult.total_count > 0) contributorStatus = 'returning-contributor';
  } catch (error) {}
  labelsToApply.push(contributorStatus);

  if (draft) labelsToApply.push('status:draft');

  // F. Update PR Labels in Github
  const currentPRLabels = pr.labels.map(l => l.name);
  const managedLabelNames = config.labels.map(l => l.name);
  
  const labelsToRemove = currentPRLabels.filter(name => managedLabelNames.includes(name) && !labelsToApply.includes(name));
  const labelsToAdd = labelsToApply.filter(name => !currentPRLabels.includes(name));

  for (const labelToRemove of labelsToRemove) {
    try {
      await apiRequest(`/repos/${owner}/${repo}/issues/${pullNumber}/labels/${encodeURIComponent(labelToRemove)}`, 'DELETE');
    } catch (e) {}
  }
  if (labelsToAdd.length > 0) {
    await apiRequest(`/repos/${owner}/${repo}/issues/${pullNumber}/labels`, 'POST', { labels: labelsToAdd });
  }

  // G. Generate and Post / Update Bot Comment
  const typeDisplay = detectedType ? `\`${detectedType}\`` : '_None detected_';
  const levelDisplay = `\`${detectedLevel}\``;
  const areaDisplay = detectedAreas.length > 0 ? detectedAreas.map(a => `\`${a}\``).join(', ') : '_None detected_';
  const reviewTimeBinDisplay = getTurnaroundEstimate(detectedLevel);

  let warnings = '';
  if (detectedLevel === 'pr-level:advanced' || detectedLevel === 'pr-level:major') {
    warnings = `> [!WARNING]\n> **Large PR**: This PR modifies ${totalLines} lines across ${changedFilesCount} files. Large PRs take significantly longer to review.`;
  }

  const commentMarkdown = `<!-- pr-automation-bot-comment -->
### 🤖 PR Dashboard

Hi @${author}! Thanks for the PR. Here is your automated analysis.

| Metadata | Details |
| :--- | :--- |
| 📁 **Files Changed** | \`${changedFilesCount}\` |
| ➕➖ **Diff Size** | \`+${additions} / -${deletions}\` |
| 🏷️ **Category** | ${typeDisplay} |
| ⚡ **Complexity**| ${levelDisplay} |
| 🧩 **Areas** | ${areaDisplay} |
| ⏱️ **Est. Review**| ${reviewTimeBinDisplay} |

${warnings}

_Note: Strict file rules and limits are processed as GitHub Check Runs. Please review the Checks tab below if you see a failure._
`;

  let existingCommentId = null;
  try {
    const comments = await apiRequest(`/repos/${owner}/${repo}/issues/${pullNumber}/comments?per_page=100`);
    for (const c of comments) {
      if (c.body && c.body.includes('<!-- pr-automation-bot-comment -->')) {
        existingCommentId = c.id;
        break;
      }
    }
  } catch (error) {}

  if (existingCommentId) {
    await apiRequest(`/repos/${owner}/${repo}/issues/comments/${existingCommentId}`, 'PATCH', { body: commentMarkdown });
  } else {
    await apiRequest(`/repos/${owner}/${repo}/issues/${pullNumber}/comments`, 'POST', { body: commentMarkdown });
  }
}

runPRMode().catch(error => {
  console.error("Fatal Error running PR triage script:", error);
  process.exit(1);
});
