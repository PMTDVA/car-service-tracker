package com.carservice.util;

import com.carservice.model.ServiceRecord;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.function.Predicate;

public class LinkedList {
    private Node head;
    private Node tail;
    private int size;

    // Node class for the linked list
    private static class Node {
        ServiceRecord data;
        Node next;

        Node(ServiceRecord data) {
            this.data = data;
            this.next = null;
        }
    }

    public LinkedList() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    // Add a new node to the end of the list
    public void append(ServiceRecord data) {
        Node newNode = new Node(data);
        
        if (head == null) {
            head = newNode;
            tail = newNode;
        } else {
            tail.next = newNode;
            tail = newNode;
        }
        
        size++;
    }

    // Add a new node to the beginning of the list
    public void prepend(ServiceRecord data) {
        Node newNode = new Node(data);
        
        if (head == null) {
            head = newNode;
            tail = newNode;
        } else {
            newNode.next = head;
            head = newNode;
        }
        
        size++;
    }

    // Get all nodes as a list
    public List<ServiceRecord> toList() {
        List<ServiceRecord> list = new ArrayList<>();
        Node current = head;
        
        while (current != null) {
            list.add(current.data);
            current = current.next;
        }
        
        return list;
    }

    // Clear the list
    public void clear() {
        head = null;
        tail = null;
        size = 0;
    }

    // Get the size of the list
    public int getSize() {
        return size;
    }

    // Check if the list is empty
    public boolean isEmpty() {
        return size == 0;
    }

    // Find a node by a predicate
    public ServiceRecord find(Predicate<ServiceRecord> predicate) {
        if (head == null) return null;
        
        Node current = head;
        
        while (current != null) {
            if (predicate.test(current.data)) {
                return current.data;
            }
            current = current.next;
        }
        
        return null;
    }

    // Remove a node by a predicate
    public ServiceRecord remove(Predicate<ServiceRecord> predicate) {
        if (head == null) return null;
        
        Node current = head;
        Node previous = null;
        
        // If the head node is the one to remove
        if (predicate.test(current.data)) {
            head = current.next;
            
            // If the list only had one node
            if (size == 1) {
                tail = null;
            }
            
            size--;
            return current.data;
        }
        
        // Search for the node to remove
        while (current != null && !predicate.test(current.data)) {
            previous = current;
            current = current.next;
        }
        
        // If the node was not found
        if (current == null) return null;
        
        // Remove the node
        previous.next = current.next;
        
        // If the tail node was removed
        if (current == tail) {
            tail = previous;
        }
        
        size--;
        return current.data;
    }

    // Sort the linked list using selection sort
    public void sort(Comparator<ServiceRecord> comparator) {
        if (size <= 1) return;
        
        List<ServiceRecord> list = toList();
        selectionSort(list, comparator);
        
        clear();
        
        for (ServiceRecord record : list) {
            append(record);
        }
    }

    // Selection sort implementation
    private void selectionSort(List<ServiceRecord> list, Comparator<ServiceRecord> comparator) {
        int n = list.size();
        
        for (int i = 0; i < n - 1; i++) {
            int minIndex = i;
            
            for (int j = i + 1; j < n; j++) {
                if (comparator.compare(list.get(j), list.get(minIndex)) < 0) {
                    minIndex = j;
                }
            }
            
            if (minIndex != i) {
                ServiceRecord temp = list.get(i);
                list.set(i, list.get(minIndex));
                list.set(minIndex, temp);
            }
        }
    }
}

