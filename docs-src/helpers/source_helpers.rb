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

    file_name = file.gsub(/\.js$/, '')
    component_details = {
      file_name: file_name,
      name: file_name.gsub('-', '_').camelize
    }
    
    if extended_class = source.match(/class\s+\w+\s+extends\s+(\w+)/).try(:[], 1)
      if extended_class_path = source.match(/import[\s\{]+#{extended_class}[\s\}]+from\s+[\'\"]([\w\.\/\-]+)/).try(:[], 1)
        component_details[:extends] = extended_class_path.match(/(\w+).js$/).try(:[], 1)
        extended_component = component(component_details[:extends])
      end
    end
    
    sections = content.split(/([^\n]+)\n(\-{2,})\n/)
    
    sections.each_with_index do |part, i|
      next unless part =~ /^\-{2,}/
      key = sections[i - 1]
      body = sections[i + 1]
      
      if body.exclude?("<")
        code = []
        body.gsub!(/```[^`]*```/) do |match|
            code << match
            "###code###"
        end
        yaml = ""
        body.gsub!(/^\s*[\w\[\]\'\"]+:.*/) do |match|
            yaml += match + "\n"
            ""
        end
        body.gsub!("###code###") do |match|
            code.shift
        end
      end
      
      attributes = yaml.present? ? YAML.load(yaml) : {}
      attributes = extended_component[key][:attributes].merge(attributes) if extended_component.try(:[], key).try(:[], :attributes)
      
      component_details[key] = {
        body: body,
        attributes: attributes
      }
    end

    match = source.match(/export\sdefault\sfunction\s#{component_details[:method]}\s?\((.*)\)/)
    component_details[:params] = match.try(:[], 1).try(:split, /\,\s?/)
    
    component_details[:name] = source.match(/export\s+default\s+class\s+(\w+)/).try(:[], 1)
    component_details[:name] ||= file_name.gsub('-', '_').camelize
    
    component_details[:source] = source.strip.sub('export default ', '')
    component_details[:example_url] = "#{component_details[:file_name]}/example"
    component_details
  end
  
  module_function :component_names, :component, :files, :base
  
end