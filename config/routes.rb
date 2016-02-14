Rails.application.routes.draw do
   root 'battles#index'
   get '/battlefield' => 'heroes#battlefield'
end
