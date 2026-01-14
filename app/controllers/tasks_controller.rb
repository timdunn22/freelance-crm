class TasksController < ApplicationController
  before_action :set_task, only: [:show, :update, :destroy, :toggle_complete]

  def index
    tasks = current_user.tasks.includes(:lead)
    tasks = filter_tasks(tasks)
    render json: tasks.map { |t| task_response(t) }
  end

  def show
    render json: task_response(@task)
  end

  def create
    task = current_user.tasks.build(task_params)
    if task.save
      render json: task_response(task), status: :created
    else
      render json: { errors: task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @task.update(task_params)
      render json: task_response(@task)
    else
      render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @task.destroy
    head :no_content
  end

  def toggle_complete
    @task.update(completed: !@task.completed)
    render json: task_response(@task)
  end

  def upcoming
    tasks = current_user.tasks.upcoming.includes(:lead).limit(10)
    render json: tasks.map { |t| task_response(t) }
  end

  def overdue
    tasks = current_user.tasks.overdue.includes(:lead)
    render json: tasks.map { |t| task_response(t) }
  end

  private

  def set_task
    @task = current_user.tasks.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Task not found' }, status: :not_found
  end

  def task_params
    params.permit(:title, :description, :due_date, :completed, :priority, :lead_id)
  end

  def filter_tasks(tasks)
    tasks = tasks.pending if params[:status] == 'pending'
    tasks = tasks.completed if params[:status] == 'completed'
    tasks = tasks.where(lead_id: params[:lead_id]) if params[:lead_id].present?
    tasks.order(:due_date)
  end

  def task_response(task)
    {
      id: task.id,
      title: task.title,
      description: task.description,
      due_date: task.due_date,
      completed: task.completed || false,
      priority: task.priority,
      overdue: task.overdue?,
      lead: task.lead ? { id: task.lead.id, name: task.lead.name } : nil,
      created_at: task.created_at
    }
  end
end
