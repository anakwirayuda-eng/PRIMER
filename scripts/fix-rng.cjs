const fs = require('fs');

const fp = 'd:/Dev/PRIMER/src/game/anamnesis/EmotionEngine.js';
let content = fs.readFileSync(fp, 'utf8');

// replace Math.random() with rand()
// but skip the polyfill itself if it got replaced
content = content.replace(/Math\.random\(\)/g, 'rand()');

fs.writeFileSync(fp, content);
console.log('Replaced Math.random() with rand() in EmotionEngine.js');
