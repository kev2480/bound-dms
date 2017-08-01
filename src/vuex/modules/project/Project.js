export class Project {
  constructor ({
    id = null,
    name = null,
    description = null,
    languages = [],
    createdAt = null,
    updatedAt = null
  }) {
    this._id = id
    this._name = name
    this._description = description
    this._languages = languages
    this._createdAt = createdAt && new Date(createdAt)
    this._updatedAt = updatedAt && new Date(updatedAt)
  }

  // Getters and Setters
  // ID
  set id (id = null) { this._id = id }
  get id () { return this._id }

  // Name
  set name (name = null) { this._name = name }
  get name () { return this._name }

  // Description
  set description (description = '') { this._description = description }
  get description () { return this._description }

  // Languages
  set languages (languages = []) { this._languages = languages }
  get languages () { return this._languages }

  // createdAt
  get createdAt () { return this._createdAt }

  // updatedAt
  get updatedAt () { return this._updatedAt }
}