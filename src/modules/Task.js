import { format } from 'date-fns'

export default class task {
    constructor (title, parentProject, myDay, important, complete, dueDate, note, creationDate) {
        this.title = title
        this.parent = parentProject
        this.myDay = myDay ?? false
        this.important = important ?? false
        this.complete = complete ?? false
        this.dueDate = dueDate ?? ''
        this.note = note ?? '' 
        this.creationDate = creationDate ?? format(new Date(),  "eee d MMM y, HH:mm").toString()
    }
    getParent () {
        return this.parent
    }
    setParent (parent) {
        return this.parent = parent
    }
    setTitle (title) {
        this.title = title
    }
    getTitle () {
        return this.title
    }
    toggleComplete () {
        this.complete == false
            ? this.complete = true
            : this.complete = false
    }
    isComplete () {
        return this.complete
    }
    toggleMyDay () {
        this.myDay == false
            ? this.myDay = true
            : this.myDay = false
    }
    isMyDay () {
        return this.myDay
    }
    toggleImportant () {
        this.important == false
            ? this.important = true
            : this.important = false
    }
    isImportant () {
        return this.important
    }
    setNote (note) {
        return this.note = note
    }
    getNote () {
        return this.note
    }
    setDueDate (date) {
        return this.dueDate = date
    }
    getDueDate () {
        return this.dueDate
    }
    removeDueDate () {
        return this.dueDate = ''
    }
    getCreationDate() {
        return this.creationDate
    }
}