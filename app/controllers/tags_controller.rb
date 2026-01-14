class TagsController < ApplicationController
  before_action :set_tag, only: [:show, :update, :destroy]

  def index
    render json: current_user.tags.map { |t| tag_response(t) }
  end

  def show
    render json: tag_response(@tag)
  end

  def create
    tag = current_user.tags.build(tag_params)
    if tag.save
      render json: tag_response(tag), status: :created
    else
      render json: { errors: tag.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @tag.update(tag_params)
      render json: tag_response(@tag)
    else
      render json: { errors: @tag.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @tag.destroy
    head :no_content
  end

  private

  def set_tag
    @tag = current_user.tags.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Tag not found' }, status: :not_found
  end

  def tag_params
    params.permit(:name, :color)
  end

  def tag_response(tag)
    {
      id: tag.id,
      name: tag.name,
      color: tag.color,
      leads_count: tag.leads.count
    }
  end
end
