# frozen_string_literal: true

module WaitForJavascript
  # Javascriptの評価結果がtrueになるまで待つマッチャー
  RSpec::Matchers.define :have_javascript do |javascript|
    match do |page|
      page.evaluate_script(javascript)
    end
  end
end

RSpec.configure do |config|
  config.include WaitForJavascript, type: :system
end
