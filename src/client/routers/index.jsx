import Unfounded from './unfounded';
import Landing from './page/landing';
import PostList from './blog/list';
import Post from './blog/post';
import SignIn from './auth/signin';
import SignOut from './auth/signout';
import Editor from './blog/editor';
import Stacks from './util/stacks';
import Settings from './util/settings';


const index = {
  auth: {
    signin: SignIn,
    signout: SignOut,
  },
  page: {
    landing: Landing,
    search: PostList,
    unfounded: Unfounded,
  },
  blog: {
    editor: Editor,
    list: PostList,
    post: Post,
  },
  util: {
    stacks: Stacks,
    settings: Settings,
  },
};


// exports
export default index;
