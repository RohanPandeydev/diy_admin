import React from 'react'
import { Table } from 'reactstrap'
import parse from 'html-react-parser'
import moment from 'moment'
import config from '../../config'
import { NavLink } from 'react-router-dom'

const TableView = ({ headers = [], data = [], showActions = false, renderActions = () => null }) => {
    return (
        <div className="member-view-wrapper">
            <div className="common-db-head mb-4">
                <div className="common-table">
                    <Table responsive>
                        <thead>
                            <tr>
                                {headers.map((header, idx) => (
                                    <th key={idx} className={header?.className || ''}>
                                        {header?.label}
                                    </th>
                                ))}
                                {showActions && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {headers.map((header, colIndex) => {
                                        const value = row[header?.key]
                                        if (header.html) {
                                            return <td key={colIndex}>

                                                {value && parse(value)}

                                            </td>
                                        }
                                        if (header.category) {
                                            return <td key={colIndex}>

                                                <NavLink to={"/seo/" + value?.parent?.slug + "/" + btoa(value?.slug)}>
                                                    {value?.name}

                                                </NavLink>

                                            </td>
                                        }
                                        if (header.date) {
                                            return <td key={colIndex}>

                                                {value && moment(value).format("lll")}

                                            </td>
                                        }
                                        if (header.image) {
                                            return <td key={colIndex}>

                                                {value ? <img className='img-fluid' height={50} width={50} src={config.apiUrl + "/" + value} /> : "No Image Found"}
                                            </td>
                                        }
                                        return (
                                            <td key={colIndex}>
                                                {typeof value === 'boolean' ? (


                                                    <>
                                                        <label>
                                                            <input
                                                                type="radio"
                                                                name={`publish-${rowIndex}`}
                                                                checked={value === true}

                                                                disabled={header.loader}
                                                                onChange={() => {
                                                                    if (typeof header.onChange === 'function') {
                                                                        header.onChange(row, header?.key);
                                                                    }
                                                                }}
                                                            />
                                                            Published



                                                        </label>
                                                        <label>
                                                            <input
                                                                type="radio"
                                                                name={`publish-${rowIndex}`}
                                                                checked={value === false}

                                                                disabled={header.loader}
                                                                onChange={() => {
                                                                    if (typeof header.onChange === 'function') {
                                                                        header.onChange(row, header?.key);
                                                                    }
                                                                }}
                                                            />
                                                            Unpublished



                                                        </label>

                                                    </>

                                                    // <input
                                                    //     type="radio"
                                                    //     name={`row-${rowIndex}`}
                                                    //     value={header?.key}
                                                    //     checked={value}
                                                    //     disabled={header.loader}
                                                    //     onChange={() => {
                                                    //         if (typeof header?.onChange == 'function') {
                                                    //             header?.onChange(row, header?.key)
                                                    //         }
                                                    //     }}
                                                    // />







                                                ) : (
                                                    value
                                                )}
                                            </td>
                                        )
                                    })}
                                    {showActions && (
                                        <td>
                                            {typeof renderActions === 'function' && renderActions(row)}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default TableView
