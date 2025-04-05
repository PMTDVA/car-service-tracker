// Node class for the linked list
class Node {
  data: any
  next: Node | null

  constructor(data: any) {
    this.data = data
    this.next = null
  }
}

// Linked List implementation for service history
export class LinkedList {
  head: Node | null
  tail: Node | null
  size: number

  constructor() {
    this.head = null
    this.tail = null
    this.size = 0
  }

  // Add a new node to the end of the list
  append(data: any) {
    const newNode = new Node(data)

    if (!this.head) {
      this.head = newNode
      this.tail = newNode
    } else {
      this.tail!.next = newNode
      this.tail = newNode
    }

    this.size++
    return this
  }

  // Add a new node to the beginning of the list
  prepend(data: any) {
    const newNode = new Node(data)

    if (!this.head) {
      this.head = newNode
      this.tail = newNode
    } else {
      newNode.next = this.head
      this.head = newNode
    }

    this.size++
    return this
  }

  // Get all nodes as an array
  toArray() {
    const array = []
    let current = this.head

    while (current) {
      array.push(current.data)
      current = current.next
    }

    return array
  }

  // Clear the list
  clear() {
    this.head = null
    this.tail = null
    this.size = 0
    return this
  }

  // Get the size of the list
  getSize() {
    return this.size
  }

  // Check if the list is empty
  isEmpty() {
    return this.size === 0
  }

  // Find a node by a callback function
  find(callback: (data: any) => boolean) {
    if (!this.head) return null

    let current = this.head

    while (current) {
      if (callback(current.data)) {
        return current.data
      }
      current = current.next
    }

    return null
  }

  // Remove a node by a callback function
  remove(callback: (data: any) => boolean) {
    if (!this.head) return null

    let current = this.head
    let previous = null

    // If the head node is the one to remove
    if (callback(current.data)) {
      this.head = current.next

      // If the list only had one node
      if (this.size === 1) {
        this.tail = null
      }

      this.size--
      return current.data
    }

    // Search for the node to remove
    while (current && !callback(current.data)) {
      previous = current
      current = current.next
    }

    // If the node was not found
    if (!current) return null

    // Remove the node
    previous!.next = current.next

    // If the tail node was removed
    if (current === this.tail) {
      this.tail = previous
    }

    this.size--
    return current.data
  }

  // Sort the linked list (using selection sort algorithm)
  sort(compareFn: (a: any, b: any) => number) {
    if (this.size <= 1) return this

    const array = this.toArray()
    const sortedArray = this.selectionSort(array, compareFn)

    this.clear()

    sortedArray.forEach((item) => {
      this.append(item)
    })

    return this
  }

  // Selection sort implementation
  private selectionSort(array: any[], compareFn: (a: any, b: any) => number) {
    const n = array.length

    for (let i = 0; i < n - 1; i++) {
      let minIndex = i

      for (let j = i + 1; j < n; j++) {
        if (compareFn(array[j], array[minIndex]) < 0) {
          minIndex = j
        }
      }

      if (minIndex !== i) {
        ;[array[i], array[minIndex]] = [array[minIndex], array[i]]
      }
    }

    return array
  }
}

