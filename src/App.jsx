import Header from './Header/header.jsx'
import './App.css'
import LeftBar from "./LeftBar/leftbar.jsx";
import Login from './Login/login.jsx'
import Content from './Content/content.jsx'
import {context, dispatchContext} from "./context.jsx";
import {useReducer} from "react";
import {default_state} from "./state.jsx";

function App() {
    const [state, dispatch] = useReducer(
        state_reducer,
        default_state
    )

    const user_idx = state.user
    const show_login_form = state.show_login_form

  return (
    <context.Provider value={state}>
        <dispatchContext.Provider value={dispatch}>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=arrow_back_ios,arrow_forward_ios" />
            <Header />
            {user_idx && !show_login_form ?
                <>
                    <div className="content">
                        <LeftBar />
                        <Content />
                    </div>
                </> : <Login/>
            }
        </dispatchContext.Provider>
    </context.Provider>
  )
}

function state_reducer(state, action) {
    switch (action.type) {
        case 'change_course': {
            return {
                ...state,
                course: action.course_num,
                page: 0
            };
        }
        case 'change_page': {
            return {
                ...state,
                page: action.page_num
            }
        }
        case 'change_user': {
            return {
                ...state,
                user: action.user
            }
        }
        case 'update_login_form_visibility': {
            return {
                ...state,
                show_login_form: action.show_login_form
            }
        }
        case 'change_data': {
            return {
                ...state,
                data: action.data
            }
        }
        case 'set_token': {
            return {
                ...state,
                token: action.token
            }
        }
        default: {
            throw Error(`Unknown action: ${action.type}`);
        }
    }
}

export default App
