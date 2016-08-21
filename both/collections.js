/**
 * Created by thomas on 18/08/16.
 */

import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Session } from 'meteor/session';

const Files = new FS.Collection("files", {
    stores: [new FS.Store.GridFS("filesStore")]
});

Files.allow({
    insert(user, doc) {
      return doc.size() < 1000000; // TODO: explain what happens if uploaded doc.size() >= 1000000
    },
    update(user, doc) {
        return doc.size() < 1000000;
    },
    download() {
        return true;
    },
    fetch: null
});

const Registered = new Mongo.Collection('registered');
const Schema = new SimpleSchema({
    name: {
        type: String,
        optional: false
    },
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        optional: false,
        autoform: {
            afFieldInput: {
                type: 'email'
            }
        }
    },
    number: {
        type: String,
        max: 12,
        optional: false,
        autoform: {
            type: 'tel',
            label: 'Mobile Phone'
        }
    },
    isPairedToday: { // Boolean to know if this person accepted to be paired today.
        type: Boolean,
        defaultValue: false,
        optional: true,
        autoform: {
            afFieldInput: {
                type: "hidden",
                label: false
            },
            afFormGroup: {
                label: false
            }
        }
    },
    isPairedWeek: { // Boolean to know if this person accepted to be paired this week.
        type: Boolean,
        defaultValue: true,
        optional: true,
        autoform: {
            afFieldInput: {
                type: "hidden",
                label: false
            },
            afFormGroup: {
                label: false
            }
        }
    },
    picture: {
        type: String,
        autoform: {
            template: "bootstrap3",
            label: 'Profile Picture (less than 1M)',
            afFieldInput: {
                type: "cfs-file",
                collection: "files"
            }
        },
        optional: false
    },
    week: { // Array to know when the user want's to be paired.
        type: [String],
        allowedValues: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        autoform: {
            type: "select",
            label: 'Days of the week',
            afFieldInput: {
                multiple: true,
                firstOption: false,
                defaultValue: 'Monday'
            }
        },
        optional: false
    }
});

Registered.allow({
    insert(){
        return true;
    },
    update(){
        return true; // There is not authentification system, so if someone delete all the database, we can restore a backup with mongoDB.
    },
    remove(){
        return true; // Same
    }
});

Registered.attachSchema(Schema);

export { Registered, Files, Schema };
