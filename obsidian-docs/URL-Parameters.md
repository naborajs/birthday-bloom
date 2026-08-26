# URL Parameters & Query Configurations

Birthday Bloom supports dynamic zero-config personalization via URL query parameters. This allows users and developers to share customized birthday experiences instantly without requiring environment changes, builds, or server redeployments.

---

## 🎯 Supported Query Parameters

| Parameter | Alias | Type | Default | Description | Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `n` | `string` | `"Special Someone"` | Recipient's name displayed across the hero header, custom letter, and celebratory badges. | `?name=Sophia` |
| `age` | `a` | `number` | `""` | Recipient's age (shown as e.g. "Happy 24th Birthday"). | `?age=24` |
| `rel` | `r` | `'partner' \| 'friend' \| 'family' \| 'crush' \| 'sibling' \| 'parent' \| 'colleague' \| 'mentor' \| 'general'` | `'general'` | Relationship preset governing emotional letter style, tone, and emoji accents. | `?rel=partner` |
| `template` | `t` | `'romantic' \| 'fun' \| 'elegant' \| 'cyberpunk' \| 'minimal' \| 'sunset'` | `'fun'` | Theme aesthetic and visual styling. | `?template=romantic` |
| `lang` | `l` | `'en' \| 'bn' \| 'hi' \| 'fr'` | `'en'` | Interface localization language (English, Bengali, Hindi, French). | `?lang=fr` |
| `pass` | `p` | `string` | `""` | Passcode required to unlock the birthday experience. | `?pass=1234` |
| `color` | `c` | `hex string` | `"#ff0080"` | Custom primary accent color (hex format, without `#` or with `%23`). | `?color=ff0080` |
| `sender` | `s` | `string` | `""` | Name of the person giving or sending the surprise. | `?sender=Alex` |
| `music` | `m` | `boolean` | `true` | Enable or disable background celebratory audio track. | `?music=true` |
| `msg` | — | `string` | `""` | Custom emotional message override displayed in the message card. | `?msg=You+are+amazing!` |
| `interests` | `i` | `comma-separated` | `""` | Comma-separated list of interests/hobbies (e.g. `cars,music,gaming,coding`). | `?interests=cars,gaming` |
| `video` | `v` | `URL string` | `""` | YouTube or direct MP4 video link embedded in the Final Surprise section. | `?video=https://youtu.be/xyz` |

---

## ⚡ URL Matrix Examples

### 1. Romantic Celebration for Partner
```
https://birthday-bloom.vercel.app/?name=Emma&rel=partner&template=romantic&color=ff2a6d&sender=Noah
```

### 2. Energetic Friend Party with Passcode & Hindi Language
```
https://birthday-bloom.vercel.app/?name=Rahul&age=21&rel=friend&template=fun&lang=hi&pass=2026&sender=Aarav
```

### 3. French Elegant Surprise for Colleague
```
https://birthday-bloom.vercel.app/?name=Claire&rel=colleague&template=elegant&lang=fr&sender=Lucas
```

### 4. Zero-Config Bengali Celebration with Music & Hobbies
```
https://birthday-bloom.vercel.app/?name=তনয়&age=25&rel=sibling&template=sunset&lang=bn&interests=cars,coding&sender=সৌরভ
```

---

## 💻 Developer Implementation

URL parameter parsing and fallback resolution are handled in [`src/features/core/config/urlParams.ts`](file:///d:/Projects/Website/birthday-bloom/src/features/core/config/urlParams.ts) and merged with environment defaults in [`src/features/core/store/useBirthdayStore.ts`](file:///d:/Projects/Website/birthday-bloom/src/features/core/store/useBirthdayStore.ts).

```typescript
import { parseUrlConfig } from '@/features/core/config/urlParams';

// Example: extracting configuration from current URL search params
const runtimeConfig = parseUrlConfig(window.location.search);
```

---

## 🔗 Related Documentation
- [[developer-guide|Developer Guide & Contributor Walkthroughs]]
- [[env-configs|Environment Variables Reference]]
- [[architecture|System Architecture & State Flow]]
