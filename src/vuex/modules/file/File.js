const uploadsDirectory = '/static/uploads/'

export class File {
  constructor ({
     id = null,
     parentId = null,
     title = null,
     description = null,
     mimeType = null,
     filename = null,
     createdAt = null,
     updatedAt = null,
     createdBy = null,
     children = [],
     projectId = null,
     directoryId = null,
     code = null
   }) {
    this._id = id
    this._parentId = parentId
    this._title = title
    this._description = description
    this._mimeType = mimeType
    this._filename = filename
    this._createdAt = createdAt && new Date(createdAt)
    this._updatedAt = updatedAt && new Date(updatedAt)
    this._createdBy = createdBy
    this._rowVariant = '' // Helps with table row selection
    this._thumbnail = null
    this._children = []
    this._path = uploadsDirectory + this._filename
    this._code = code

    children.forEach((child) => {
      let file = new File(child)
      this._children.push(file)
      if (this._thumbnail === null && child.metadata === 'system-thumbnail') {
        this._thumbnail = file
      }
    })
    this._projectId = projectId
    this._directoryId = directoryId
    this._hidden = false // Helper boolean for hiding away unlinked files
  }

  get id () { return this._id }

  set parentId (parentId) { this._parentId = parentId }
  get parentId () { return this._parentId }

  set projectId (projectId) { this._projectId = projectId }
  get projectId () { return this._projectId }

  set directoryId (directoryId) { this._directoryId = directoryId }
  get directoryId () { return this._directoryId }

  get children () { return this._children }

  get thumbnail () { return this._thumbnail }

  set title (title) { this._title = title }
  get title () { return this._title }

  set description (description) { this._description = description }
  get description () { return this._description }

  get mimeType () { return this._mimeType }

  get filename () { return this._filename }

  get path () { return this._path }

  get code () { return this._code }

  get createdAt () { return this._createdAt }

  get updatedAt () { return this._updatedAt }

  get createdBy () { return this._createdBy }

  set hidden (hidden) { this._hidden = hidden }
  get hidden () { return this._hidden }

  set rowVariant (rowVariant) { this._rowVariant = rowVariant }
  get rowVariant () { return this._rowVariant }

  /**
   * [flatten Get backend friendly File object]
   * @return {Object} The File object (without the nesting)
   */
  flatten () {
    return {
      id: this.id,
      title: this.title,
      parentId: this.parentId,
      projectId: this.projectId,
      directoryId: this.directoryId,
      children: this.children,
      thumbnail: this.thumbnail,
      description: this.description,
      filename: this.filename,
      mimeType: this.mimeType,
      path: this.path,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      createdBy: this.createdBy
    }
  }
}
