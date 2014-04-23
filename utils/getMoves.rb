# -*- coding: utf-8 -*-
require 'open-uri'
require 'nokogiri'

url = 'http://seesaawiki.jp/w/inatekken/d/%b8%c7%cd%ad%b5%bbTUD'

charset = nil
html = open(url) do |f|
  charset = f.charset # 文字種別を取得
  f.read # htmlを読み込んで変数htmlに渡す
end

doc = Nokogiri::HTML.parse(html, nil, charset)

charactors = []

doc.css('#content_block_4 td').each do |node|

  name = node.css('a').inner_text

  if name != ""
    link = node.css('a').attr('href').value
    charactor = {:name => name, :link => link}
    charactors.push charactor
  end

end

moves = []

charactors.each do |charactor|

  html = open(charactor[:link]) do |f|
    charset = f.charset # 文字種別を取得
    f.read # htmlを読み込んで変数htmlに渡す
  end

  doc = Nokogiri::HTML.parse(html, nil, charset)

  doc.css('#content_block_2 tr').each do |node|

    move = [charactor[:name]]
    node.css('td').each do |td|
        move.push td.inner_text
    end

#     tmp = {:charactor => charactor[:name], :name => move[0], :command => move[1]}

#     tmp = [charactor[:name]]

    moves.push move if move.length > 1

  end

end

moves.each do |move|
  # puts "db.moves.save({charactor: '" + move[0] + 
  #   "', name:'" + move[1] +
  #   "', command:'"+ move[2] + 
  #   "', detection:'"+ move[3] +
  #   "', damage:'"+ move[4] +
  #   "', startup:'"+ move[5] +
  #   "', guard:'"+ move[6] +
  #   "', hit:'"+ move[7] +
  #   "', ch:'"+ move[8] + "'})"

  move.map do |data|
    data.gsub!(',', '.')
  end

  puts move.join(',')
end
