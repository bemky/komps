module SourceHelpers
  
  def components
    return @components if @components
    @components = []
    base = File.expand_path('../../lib/komps', __dir__)
    files = Dir.glob("*.js", base: base)
    files.each do |file|
      body = File.read(File.join(base, file))
      content = body.match(/\/\*.*(?=\*\/)/m).to_s
      source = body.split(/\*\//, 2).last

      component_details = {
        name: file.gsub(/\.js$/, '')
      }
      sections = content.split(/([^\n]+)\n(\-{2,})\n/)
      sections.each_with_index do |part, i|
        next unless part =~ /\-{2,}/
        component_details[sections[i - 1]] = sections[i + 1]
      end

      match = source.match(/export\sdefault\sfunction\s#{component_details[:method]}\s?\((.*)\)/)
      component_details[:params] = match.try(:[], 1).try(:split, /\,\s?/)
      component_details[:source] = source.strip.sub('export default ', '')
      @components.push(component_details)
    end
    @components
  end
  
  module_function :components
  
end