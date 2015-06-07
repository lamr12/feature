#Make sure plugin is installed
unless Vagrant.has_plugin?("vagrant-ansible-local")
  system('vagrant plugin install vagrant-ansible-local')
  raise("Plugin installed. Run command again.");
end

Vagrant.configure(2) do |config|

  config.vm.box = "ubuntu_i386_14.04"
  config.vm.box_url = "https://cloud-images.ubuntu.com/vagrant/trusty/current/trusty-server-cloudimg-i386-vagrant-disk1.box" 

  config.vm.network :forwarded_port, guest: 80, host: 9090

  config.vm.provision :shell, path: "bootstrap.sh"

  config.vm.provision :ansibleLocal, :playbook => "ansible-playbooks/main.yml"

end