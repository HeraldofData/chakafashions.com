# Seasons

The website shows a different top banner ("hero") depending on the season.

| Season | Shows | Dates (automatic) |
|---|---|---|
| `christmas` | Red festive banner: lights, ornaments, snow, January-disease reminder | 1 Nov – 26 Dec |
| `january` | Green Back to School banner: bunting flags, confetti, term reminder | 27 Dec – 31 Jan |
| `original` | Clean white everyday version ("simpler times") | rest of the year |

## Switch manually
Open `seasons/seasons.js` and set line 7:

```js
const FORCE_SEASON = "january";   // or "christmas", "original", or null for automatic
```

Commit and push; the site updates in about a minute.

## Preview without publishing
- https://chakafashions.com/?season=christmas
- https://chakafashions.com/?season=january
- https://chakafashions.com/?season=original

## Files
- `seasons.js`: picks the season (manual switch, calendar, preview link), January bunting + confetti
- `seasons.css`: January styles
- The banners themselves are in `index.html` (`#hero-christmas`, `#hero-january`, `.hero-standard`)
