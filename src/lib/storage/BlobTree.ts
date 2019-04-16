import { Container } from './Container'
import { Blob } from './Blob'

// The BlobTree is a tree structure. Its internal Nodes are called Containers. Its leaves are called Blobs.
// A Blob has methods setData and getData, which take and return a ReadableStream, so that you can store opaque
// data in them.
// A Container doesn't have much functionality except that you can query a list of its Members (its children in the tree).
//
// A path is defined by a list of path segments, which are strings.
// To allow for convenient slash-separated concatenation of path segments, they are not allowed to contain the '/' character.
// The Path of a Node is the list of names of nodes you have to visit to get to it.
// A Path always starts with 'root', and ends with the Node's own name; for instance: ['root', 'foo', 'bar']
// Sibling Nodes are not allowed to have the same name.

export class Path {
  segments: Array<string>
  constructor (segments: Array<string>) {
    if (!segments.length || segments[0] !== 'root') {
      throw new Error('Path should start at the root')
    }
    segments.map(segment => {
      if (segment.indexOf('/') !== -1) {
        throw new Error('No slashes allowed in path segments!')
      }
    })
    this.segments = segments
  }
  toString (): string {
    return this.segments.join('/')
  }
  toContainerPathPrefix (): string {
    return this.toString() + '/'
  }
}

// throws:
// sub-blob attempt
// getData/setData when doesn't exist
// containers always exist, unless there is a blob at their filename
// creating a path ignores the trailing slash
export interface BlobTree {
  getContainer (path: Path): Container
  getBlob (path: Path): Blob
  on (eventName: string, eventHandler: (event: any) => void): void
}