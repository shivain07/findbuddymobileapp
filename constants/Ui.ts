

export const ROUTES = {
  protected: {
    home: "/protected/home",
    profile: "/protected/profile",
    feed: "/protected/feed",
    setting: "/protected/setting",
    search: "/protected/search",
  },
  general: {
    login: "/login",
    search: "/search",
    signup: "/signup",
    landing: "/"
  }
}

export const UNPROTECTED_ROUTES = [
  ROUTES.general.landing,
  ROUTES.general.signup,
  ROUTES.general.login,
  ROUTES.general.search,
]

export const API_PATH = {
  user: {
    login: "users/login",
    logout: "users/logout",
    signup: "users/signup",
    sendmail: "users/sendmail",
    verify: "users/verify",
    update: "users/update"
  },
  tokenChange: "tokenchange",
  post: {
    add: "post/addpost",
    get: "post/getpost",
    getRelevant: "post/getRelevantPost",
    like: "post/likepost",
    delete: "post/deletePost"
  },
  comment: {
    add: "comment/add",
    get: "comment/get",
  },
  search: "search",
  token:{
    verifyRFToken:"token/verify"
  }
};

export const ROUTES_WITH_VERIFICATION = [
  API_PATH.post.like,
  API_PATH.comment.add,
  API_PATH.post.add
]

export const ROUTES_WITH_LOGIN = [
  API_PATH.post.like,
  API_PATH.comment.add,
  API_PATH.post.add
]

export const AUTH = {
  accessTokenValid: "ATOKEN_VALID",
  accessTokenInValid: "ATOKEN_INVALID",
  refreshTokenInValid: "RTOKEN_INVALID",
  accessTokenNA: "ATOKEN_NA",
}
export const ERROR_TYPES = {
  verifcationToken: "VFTOKEN"
}