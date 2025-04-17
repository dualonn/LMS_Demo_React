import {useState, useContext, useEffect} from "react";
import {context, dispatchContext} from "../context";
import './leftbar.css'
import axios from 'axios'
import Select from "react-select"

function LeftBar() {

    const state = useContext(context)
    const dispatch = useContext(dispatchContext)

    const [loading, set_loading] = useState(true);
    const [error, set_error] = useState(null);

    const url = "https://svu-csc-django-backend.online/section/"

    const header = {
        headers: {
            'Authorization': `Token ${state.token}`
        }
    }

    useEffect(() => {
        const FetchData = async () => {
            try {
                const response = await axios.get(url, header);
                const alldata = [...response.data, ...state.courses]
                dispatch({
                    type: 'change_data',
                    data: alldata
                })
                set_loading(false)
            } catch (error) {
                set_error(error)
                set_loading(false)
            }
        }
        FetchData()
        return () => {}
    }, [])

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>

    //console.log(state.data)

    let dropdown_options = []
    if(state.data) {
        dropdown_options = state.data.map((_class, index) => ({value: index, label: _class.title}))
        console.log(dropdown_options)
        console.log(state.quizzes)
    }

    function select_course(option){
        console.log(option)
        dispatch({
            type: 'change_course',
            course_num: option.value
        })
    }

    return (
        <div className="leftbar">
            {state.data ?
                <>
                    <Select options={dropdown_options} value={dropdown_options[state.course]} onChange={select_course}/>
                        <ul>
                            {state.data[state.course].pages.map((pg, index) => (
                                <li key={`page${index}`} onClick={() => {
                                    dispatch({
                                        type: 'change_page',
                                        page_num: index
                                    })
                                }}>{index+1}.{pg.title}
                            </li>
                        ))}
                    </ul>
                </>
            : ''}
        </div>
    )
}
export default LeftBar;