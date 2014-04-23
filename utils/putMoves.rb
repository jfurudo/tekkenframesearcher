require "rest_client"

f = open("./moves.csv")
f.each do |line|
  data = line.split(',')
  json = {
    :charactor => data[0],
    :name =>  data[1],
    :command => data[2], 
    :detection => data[3],
    :damage => data[4],
    :startup => data[5],
    :guard => data[6],
    :hit => data[7],
    :ch => data[8]
  }
  puts json.join(',')
#   RestClient.post("http://localhost:1337/move/create", json, :content_type => :json, :accept => :json)
end
f.close
