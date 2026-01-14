module AuthHelpers
  def jwt_secret
    Rails.application.credentials.secret_key_base || 'development_secret_key'
  end

  def generate_token(user)
    JWT.encode({ user_id: user.id, exp: 24.hours.from_now.to_i }, jwt_secret, 'HS256')
  end

  def auth_headers(user)
    { 'Authorization' => "Bearer #{generate_token(user)}" }
  end
end
