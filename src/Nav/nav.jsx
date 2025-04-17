import {useContext} from "react";
import {context, dispatchContext} from "../context.jsx";
import './nav.css'

function Nav(){
    const state = useContext(context);
    const dispatch = useContext(dispatchContext);
    const _class = state.data[state.course]
    const page = _class.pages[state.page]
    const page_num = state.page

    function increment(){
        dispatch({
            type: "change_page",
            page_num: state.page + 1
        })
    }
    function decrement(){
        dispatch({
            type: "change_page",
            page_num: state.page - 1
        })
    }

    return(
        <div className="nav">
            <div className={`${state.page < 1 ? "hidden" : "visible"}`}>
                <span onClick={decrement} className="material-symbols-outlined">arrow_back_ios</span>
            </div>

            <h3>{page.title}</h3>

            <div className={`${state.page >= _class.pages.length-1 ? "hidden" : "visible"}`}>
                <span onClick={increment} className="material-symbols-outlined">arrow_forward_ios</span>
            </div>
        </div>
    )
}
export default Nav