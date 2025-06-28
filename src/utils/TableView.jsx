import React, { useState } from 'react'
import { Button, Table } from 'reactstrap'
import parse from 'html-react-parser'
import moment from 'moment'
import config from '../../config'
import { NavLink } from 'react-router-dom'
import { FaEye, FaRegEdit } from 'react-icons/fa'

const TableView = ({ headers = [], data = [], showActions = false, renderActions = () => null }) => {
    const [expandedRows, setExpandedRows] = useState({})

    const toggleRow = (index, value) => {
        setExpandedRows((prev) => ({
            ...prev,
            [index]: !prev[index],
            value: value
        }))
    }


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
                            {data.map((row, rowIndex) => {

                                return (
                                    <React.Fragment key={rowIndex}>
                                        <tr>
                                            {headers.map((header, colIndex) => {
                                                const value = row[header?.key]

                                                if (header.html) {
                                                    return <td key={colIndex} className='truncate-button' style={{ minWidth: '250px', maxWidth: '300px' }}>
                                                        <div style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal', wordBreak: 'break-word', }}>
                                                            {value && parse(value)}
                                                        </div>
                                                    </td>
                                                }
                                                if (header.json) {
                                                    return <td key={colIndex}>{value && JSON.parse(value)}</td>
                                                }

                                                if (header.category) {
                                                    return (
                                                        <td key={colIndex}>
                                                            <NavLink to={"/seo/" + value?.parent?.slug + "/" + btoa(value?.slug)}>
                                                                {value?.name || "N/A"}
                                                            </NavLink>
                                                        </td>
                                                    )
                                                }

                                                if (header.date) {
                                                    return <td key={colIndex}>{value && moment(value).format("lll")}</td>
                                                }

                                                if (header.nested) {
                                                    return (
                                                        <td key={colIndex} >
                                                            {value?.length == 0 ? "N/A" : <button className="btn btn-sm btn-outline-primary" onClick={() => toggleRow(rowIndex, value)}>
                                                                {expandedRows[rowIndex] ? 'Hide' : 'Show'} Sub Category
                                                            </button>}
                                                        </td>
                                                    )
                                                }

                                                if (header.image) {
                                                    return (
                                                        <td key={colIndex}>
                                                            {value ? (
                                                                <img className='img-fluid' height={50} width={50} src={config.apiUrl + "/" + value} />
                                                            ) : "No Image Found"}
                                                        </td>
                                                    )
                                                }

                                                return (
                                                    <td key={colIndex}>
                                                        {typeof value === 'boolean' ? (
                                                            <>
                                                                <label className='blog-table-radio mb-1'>
                                                                    <input
                                                                        type="radio"
                                                                        name={`publish-${rowIndex}`}
                                                                        checked={value === true}
                                                                        disabled={header.loader}
                                                                        onChange={() => header.onChange?.(row, header?.key)}
                                                                    />
                                                                    Published
                                                                </label>
                                                                <label className='blog-table-radio'>
                                                                    <input
                                                                        type="radio"
                                                                        name={`publish-${rowIndex}`}
                                                                        checked={value === false}
                                                                        disabled={header.loader}
                                                                        onChange={() => header.onChange?.(row, header?.key)}
                                                                    />
                                                                    Unpublished
                                                                </label>
                                                            </>
                                                        ) : (
                                                            header?.isAction ? value || "" : value || "N/A"
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

                                        {/* Nested row display */}
                                        {expandedRows[rowIndex] && (
                                            <tr>
                                                <td colSpan={headers.length + (showActions ? 1 : 0)}>
                                                    {row.child?.length > 0 ? (


                                                        <Table bordered size="sm">
                                                            <thead>
                                                                <tr>
                                                                    <th>Name</th>
                                                                    <th>Slug</th>
                                                                    <th>Actions</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {row.child.map((item, i) => {
                                                                    const parentslug = row?.slug
                                                                    return <tr key={i}>
                                                                        <td>{item.name}</td>
                                                                        <td>{item.slug}</td>
                                                                        <td>
                                                                            <NavLink to={`/seo/${parentslug}/${btoa(item.slug)}`}>
                                                                                <Button color="info" size="sm" className="me-2"><FaEye /></Button>
                                                                            </NavLink>
                                                                            <NavLink to={`/seo/${parentslug}/update/${btoa(item.slug)}`}>
                                                                                <Button color="primary" size="sm"><FaRegEdit /></Button>
                                                                            </NavLink>
                                                                        </td>
                                                                    </tr>
                                                                })}
                                                            </tbody>
                                                        </Table>
                                                    ) : (
                                                        <span>No nested data available.</span>
                                                    )}
                                                </td>
                                            </tr>
                                        )}

                                    </React.Fragment>
                                )
                            })}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default TableView
