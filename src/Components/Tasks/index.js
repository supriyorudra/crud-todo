import React from 'react'

const Tasks = ({ todo,
    key,
    index,
    handleEdit,
    handleDelete }) => {
    return (
        <>
            {/* single tasks to map all the tasks */}
            {
                <li key={key++}>
                    <h3>{todo.title}</h3>
                    <p className='desc'>{todo.description}</p>
                    <div className='info'>
                        <p >Due date: {todo.dueDate}</p>
                        <p>Status: {todo.status}</p>
                    </div>
                    <div className="icons">
                        <p id={index} onClick={handleEdit} style={{ cursor: 'pointer', color: '#fff', backgroundColor: 'blue', borderRadius: '10px' }}>Edit</p>
                        <p id={index} onClick={handleDelete} style={{ cursor: 'pointer', color: '#fff', backgroundColor: 'red', borderRadius: '10px' }}>Delete</p>
                    </div>
                </li>
            }
        </>
    )
}

export default Tasks