# frozen_string_literal: true

module ApplicationHelper # :nodoc:
  def google_maps_api_key
    Rails.application.credentials.dig(:google_maps, Rails.env.to_sym, :api_key)
  end

  def default_meta_tags
    {
      site: 'Sketto',
      title: 'あなたの移動、お任せください',
      reverse: true,
      charset: 'utf-8',
      description: '複数の訪問時のプランニングをサポートします。',
      keywords: 'ルート検索, 最短経路, 家庭訪問, 旅行計画',
      canonical: request.original_url,
      separator: '|',
      og: {
        site_name: :site,
        title: :title,
        description: :description,
        type: 'website',
        url: request.original_url,
        image: image_url('ogp.png'),
        locale: 'ja_JP'
      }
    }
  end
end
