const fs = require('fs');
const path = require('path');

function walk(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          if (file.endsWith('.html')) results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
}

['export/html', 'pages'].forEach(dir => {
  walk(dir, (err, results) => {
    if (err) return console.error(err);
    results.forEach(file => {
      let content = fs.readFileSync(file, 'utf8');
      content = content.replace(/href="https:\/\/fonts\.googleapis\.com\/css2\?family=Poppins:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"/g, 'href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Inter:wght@400;500;600&display=swap"');
      fs.writeFileSync(file, content, 'utf8');
      console.log('Updated ' + file);
    });
  });
});
