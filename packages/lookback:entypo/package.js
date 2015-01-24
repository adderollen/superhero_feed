var where = 'client'

Package.describe({
  name: 'lookback:entypo',
  version: '0.1.0',
  description: 'Entypo icons packaged as an SVG sprite.'
})

Package.on_use(function(api) {
  api.use('templating', where)
  api.imply('templating', where)

  api.addFiles('svg/entypo.svg', where, { isAsset: true })
  api.addFiles('template.html', where)
})
