import React from 'react'
import AttributeErrors from './AttributeErrors'

/**
 * @param {{
 *  value: string
 *  label: string
 *  description: string
 *  validationErrors: import('../../../../shared/validationTypes').ValidationError[]
 *  dataPath: string
 *  attributeName: string
 *  children?: React.ReactNode
 *  onUpdate({}): void
 * }} props
 */
export default function Attribute({
  value,
  label,
  description,
  dataPath,
  attributeName,
  children,
  onUpdate,
  ...props
}) {
  const validationErrors = props.validationErrors.filter(
    (e) => e.dataPath === dataPath
  )
  return (
    <section className="my-2">
      {value != null ? (
        <>
          <h1 title={description}>{label}</h1>
          {children}
          <AttributeErrors validationErrors={validationErrors} />
        </>
      ) : (
        <button
          type="button"
          className="border py-2 px-3 hover:bg-gray-200"
          onClick={() => {
            onUpdate({
              $set: '',
            })
          }}
        >
          Create {attributeName}
        </button>
      )}
    </section>
  )
}