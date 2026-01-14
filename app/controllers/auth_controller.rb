class AuthController < ApplicationController
  skip_before_action :authenticate_request, only: [:login, :register]

  def register
    user = User.new(user_params)
    if user.save
      token = generate_token(user)
      render json: { token: token, user: user_response(user) }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def login
    user = User.find_by(email: params[:email])
    if user&.authenticate(params[:password])
      token = generate_token(user)
      render json: { token: token, user: user_response(user) }
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end

  def me
    render json: { user: user_response(current_user) }
  end

  private

  def user_params
    params.permit(:email, :password, :password_confirmation, :name)
  end

  def generate_token(user)
    JWT.encode({ user_id: user.id, exp: 24.hours.from_now.to_i }, jwt_secret, 'HS256')
  end

  def user_response(user)
    { id: user.id, email: user.email, name: user.name }
  end
end
