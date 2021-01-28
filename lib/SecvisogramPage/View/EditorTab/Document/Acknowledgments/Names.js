import React from 'react'
import AttributeArray from '../../shared/AttributeArray'
import DeleteArray from '../../shared/DeleteArray'
import Object from '../../shared/Object'
import TextAttribute from '../../shared/TextAttribute'

/**
 * @param {{
 *  validationErrors: import('../../../../../shared/validationTypes').ValidationError[]
 *  value?: string[]
 *  dataPath: string
 *  objectName: string
 *  onUpdate({}): void
 * }} props
 */
export default function Names({
  value: names,
  validationErrors,
  dataPath,
  objectName,
  onUpdate,
}) {
  return (
    <Object
      label="List of acknowledged names"
      description="Contains the names of entities being recognized."
      validationErrors={validationErrors}
      dataPath={dataPath}
      objectName={objectName}
      object={names}
      doAdd={() => {
        onUpdate({
          $set: [''],
        })
      }}
      doDelete={() => {
        onUpdate({ $set: undefined })
      }}
    >
      {names ? (
        <AttributeArray array={names} onUpdate={onUpdate}>
          {({ value, index, onUpdate: onItemUpdate }) => (
            <TextAttribute
              label="Name of entity being recognized"
              description="Contains the name of a single person."
              placeholder="Johann Sebastian Bach"
              required
              validationErrors={validationErrors}
              dataPath={`${dataPath}/${index}`}
              attributeName="entry"
              value={value}
              onUpdate={onItemUpdate}
            >
              <DeleteArray
                array={names}
                doDelete={() => {
                  onUpdate({
                    $splice: [[index, 1]],
                  })
                }}
              />
            </TextAttribute>
          )}
        </AttributeArray>
      ) : null}
    </Object>
  )
}