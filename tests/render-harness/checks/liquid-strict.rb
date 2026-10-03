# SOLO TEST · Parseo Liquid estricto con la gema oficial de Shopify (liquid 5.14.0).
# Uso: ruby checks/liquid-strict.rb [tema] [strict|lax]   → imprime «BAD 0» si todo parsea.
# Las etiquetas propias de Shopify (schema, form, section…) se registran como bloques/etiquetas
# neutras: solo se comprueba la sintaxis Liquid, no el render.
begin
  require 'liquid'
rescue LoadError
  warn 'Falta la gema liquid: gem install liquid -v 5.14.0 (ver README).'
  exit 2
end
class RawBlock < Liquid::Raw; end
class PassBlock < Liquid::Block; def initialize(t,m,o); super; end; end
class PassTag < Liquid::Tag; end
%w[schema javascript].each { |t| Liquid::Template.register_tag(t, RawBlock) }
%w[style stylesheet form paginate].each { |t| Liquid::Template.register_tag(t, PassBlock) }
%w[section sections layout content_for].each { |t| Liquid::Template.register_tag(t, PassTag) }
mode = (ARGV[1] || 'strict').to_sym
root = File.expand_path(ARGV[0] || File.join(__dir__, '..', '..', '..'))
bad = 0
Dir.glob(File.join(root, '{layout,sections,snippets,templates}/*.liquid')).sort.each do |f|
  src = File.read(f, encoding: 'UTF-8').gsub(/{%-?\s*render block\s*-?%}/, '')
  begin
    Liquid::Template.parse(src, error_mode: mode, line_numbers: true)
  rescue Liquid::Error => e
    bad += 1
    puts "#{f.sub(root + '/', '')}: #{e.message[0, 200]}"
  end
end
puts "BAD #{bad}"
exit(bad.zero? ? 0 : 1)
