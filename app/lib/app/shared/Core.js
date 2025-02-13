import { compose, set } from 'lodash/fp.js'
import * as basic from '../../../../csaf-validator-lib/basic.js'
import strip from '../../../../csaf-validator-lib/strip.js'
import validate from '../../../../csaf-validator-lib/validate.js'
import doc_max from './Core/doc-max.json'
import doc_min from './Core/doc-min.json'
import doc_websphere from './Core/doc-websphere.json'
import { DocumentEntity } from './Core/entities.js'

const INSTANT_TESTS = Object.values(basic)

const secvisogramName = 'Secvisogram'

/* eslint-disable */
const secvisogramVersion =
  typeof SECVISOGRAM_VERSION !== 'undefined'
    ? SECVISOGRAM_VERSION.startsWith('v')
      ? SECVISOGRAM_VERSION.substr(1)
      : SECVISOGRAM_VERSION
    : 'unidentified version'
/* eslint-enable */

const setGeneratorFields = (/** @type {Date} */ date) =>
  compose(
    set('document.tracking.generator.engine.name', secvisogramName),
    set('document.tracking.generator.engine.version', secvisogramVersion),
    set('document.tracking.generator.date', date.toISOString())
  )

/**
 * This is a factory-function which instantiates the business-logic object.
 * Logic which can be abstracted without UI-interaction should be placed here
 * to be tested independently.
 */
export default function createCore() {
  return {
    document: {
      /**
       * Validates the document and returns errors that possibly occur.
       *
       * @param {object} params
       * @param {{}} params.document
       * @returns {Promise<{
       *   isValid: boolean;
       *   errors: {
       *     message?: string | undefined;
       *     instancePath: string;
       *   }[];
       * }>}
       */
      async validate({ document }) {
        const res = await validate(INSTANT_TESTS, document)
        return {
          isValid: res.isValid,
          errors: res.tests.flatMap((t) => t.errors),
        }
      },

      /**
       * @typedef {Object} FullProductName
       * @property {string} name
       * @property {string} product_id
       */

      /**
       * @typedef {Object} Branch
       * @property {Array<Branch>} branches
       * @property {FullProductName} product
       */

      /**
       * This method collects product_ids and corresponding names in the given document and returns a result object.
       *
       * @param {{
       *  document: any
       *  strict?: boolean
       * }} params
       * @returns {Promise<{id: string, name: string}[]>}
       */
      async collectProductIds({ document }) {
        const documentEntity = new DocumentEntity()
        return documentEntity.collectProductIds({ document })
      },

      /**
       * This method collects group_ids and corresponding summaries in the given document and returns a result object.
       *
       * @param {{
       *  document: any
       *  strict?: boolean
       * }} params
       * @returns {Promise<{id: string, name: string}[]>}
       */
      async collectGroupIds({ document }) {
        const documentEntity = new DocumentEntity()
        return documentEntity.collectGroupIds({ document })
      },

      /**
       * Provides a minimal new document.
       */
      newDocWebSphere() {
        return setGeneratorFields(new Date())({
          ...doc_websphere,
        })
      },

      /**
       * Provides a minimal new document.
       */
      async newDocMin() {
        return setGeneratorFields(new Date())({
          ...doc_min,
        })
      },

      /**
       * Provides a maximal new document.
       */
      async newDocMax() {
        return setGeneratorFields(new Date())({
          ...doc_max,
        })
      },

      /**
       * Strips the document according to the CSAF-algorithm and returns a list
       * of removed elements.
       *
       * @param {object} params
       * @param {{}} params.document
       */
      async strip({ document }) {
        const res = await strip(INSTANT_TESTS, document)

        return res
      },

      /**
       * Extends the current document with data required for preview and returns the extended document.
       *
       * @param {{
       *  document: {}
       *  strict?: boolean
       * }} params
       */
      async preview({ document }) {
        const documentEntity = new DocumentEntity()
        return documentEntity.preview({ document })
      },

      getGeneratorEngineData() {
        return {
          name: secvisogramName,
          version: secvisogramVersion,
        }
      },
    },
  }
}
