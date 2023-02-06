import React from "react"
import * as Yup from 'yup'
import {Formik, Form, FastField} from "formik"
import {Field}     from "@root/src/types/Field"
import {FormField} from "../FormField/FormField"
import {FormRow}   from "../FormRow/FormRow"

/**
 * UserForm.
 */
type UserFormArgs = {
  fields  : Array<Field>
  onSubmit: Function
}

const nonInputFields = ["markup", "submit"]

/**
 * Get the initial values.
 *
 * @param {Array<Field>} fields
 *   The fields to map the values for.
 */
const initialValues = (fields: Array<Field>) => {
  return fields.reduce((values, field) => {
    values[field.name] = ""
    return values
  }, {})
}

/**
 * Build the validation schema.
 *
 * @param {Array<Field>} fields
 *   The fields to build the schema for.
 */
const validationSchemaBuild = (fields: Array<Field>) => {
  const validationSchema = {}

  fields.forEach(field => {
    let fieldValidation = Yup.string()

    if (field.type === "email") {
      fieldValidation = fieldValidation.email(field.errorMessages.email)
    }

    if (field.required) {
      fieldValidation = fieldValidation.required(field.errorMessages.required)
    }

    if (field.equals) {
      fieldValidation = fieldValidation.oneOf([Yup.ref(field.equals), null], field.errorMessages.equals)
    }

    validationSchema[field.name] = fieldValidation
  })

  return validationSchema
}


/**
 * UserForm element.
 *
 * @param {Field} fields
 *   The form fields to render.
 * @param {Function} onSubmit
 *   On submit callback.
 *
 * @constructor
 */
export const WebForm = ({fields, onSubmit}: UserFormArgs) => {
  const userInputFields = fields.filter(field => !nonInputFields.includes(field.type))

  return (
    <div className={"m-webform"}>
      <Formik
        initialValues={initialValues(userInputFields)}
        validationSchema={Yup.object().shape(validationSchemaBuild(userInputFields))}
        onSubmit={(values) => onSubmit(values)}>
        {
          ({values, errors, setFieldValue, handleBlur, touched}) => {
            return (
              <Form>
                {fields.map((field, key) => {
                  return (
                    <FormRow key={key}>
                      <FastField name={field.name} >
                        {() => (
                          <FormField
                            defaultValue={field.value}
                            label={field.label}
                            name={field.name}
                            type={field.type}
                            options={field.options}
                            handleChange={setFieldValue}
                            handleBlur={handleBlur}
                            value={values[field.name]}
                            error={errors[field.name] && touched[field.name] ? errors[field.name] : ""}
                          />
                        )}
                      </FastField>
                    </FormRow>
                  )
                })}
              </Form>
            )
          }
        }
      </Formik>
    </div>
  )
}