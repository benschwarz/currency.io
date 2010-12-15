desc "Compress javascripts into /public/javascripts/application.min.js"
task :compress_scripts do
  `closure --js=public/javascripts/json.js --js=public/javascripts/dataset.js --js=public/javascripts/application.js --compilation_level=SIMPLE_OPTIMIZATIONS --js_output_file=public/javascripts/application.min.js`
end