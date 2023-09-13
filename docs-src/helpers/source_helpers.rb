module SourceHelpers
  
  def base
    File.expand_path('../../lib/komps', __dir__)
  end
    
  def files
    Dir.glob("*.js", base: base)
  end
  
  def component_names
    files.map do |file|
      file.gsub(/\.js$/, '')
    end.reject{|x| x == "support"}
  end
  
  def component(name)
    file = files.find{|x| x =~ /#{name}\.js$/}
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
    component_details[:example_url] = "#{component_details[:name]}/example"
    component_details
  end
  
  module_function :component_names, :component, :files, :base
  
end