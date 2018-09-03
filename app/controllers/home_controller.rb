class HomeController < ApplicationController

  def index
    #TODO: Do we have to cache the token and token_secret? Could replace with just caching access_token info.
    if !(session[:token] && session[:token_secret] && params["authorize"]) # Try authorizing
      consumer = get_oauth_consumer
      request_token = consumer.get_request_token
      session[:token] = request_token.token
      session[:token_secret] = request_token.secret
      current_url = request.original_url
      redirect_to(request_token.authorize_url + "&oauth_callback=#{current_url}")

    elsif params["authorize"] == "1" # User authorized
      if !(session[:access_token] && session[:access_token_secret])
        # No access_token, so generate access_token
        request_hash = { oauth_token: session[:token], oauth_token_secret: session[:token_secret]}
        consumer = get_oauth_consumer
        request_token  = OAuth::RequestToken.from_hash(consumer, request_hash)
        access_token = request_token.get_access_token
        # in the initial session, we'll store token and secret somewhere
        session[:access_token] = access_token.token
        session[:access_token_secret] = access_token.secret
      end
      # in subsequent sessions, we'll rebuild the access token
      consumer = get_oauth_consumer
      access_token = OAuth::AccessToken.new(consumer, session[:access_token], session[:access_token_secret])
      client = Goodreads.new(oauth_token: access_token)
      @user_id = client.user_id

    elsif params["authorize"] == "0" # User declined to authorize
      Rails.logger.debug("User has declined to authenticate")
      @user_id = ""
    end

    @authorize = params["authorize"]
  end

end
