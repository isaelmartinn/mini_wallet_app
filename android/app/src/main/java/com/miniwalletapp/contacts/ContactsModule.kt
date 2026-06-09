package com.miniwalletapp.contacts

import android.Manifest
import android.content.pm.PackageManager
import android.provider.ContactsContract
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.PermissionAwareActivity
import com.facebook.react.modules.core.PermissionListener

class ContactsModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), PermissionListener {

    companion object {
        private const val PERMISSION_REQUEST_CODE = 1001
        private const val E_PERMISSION_DENIED = "E_PERMISSION_DENIED"
        private const val E_CONTACTS_ERROR = "E_CONTACTS_ERROR"
    }

    private var permissionPromise: Promise? = null

    override fun getName(): String = "ContactsModule"

    @ReactMethod
    fun requestPermission(promise: Promise) {
        val activity = currentActivity

        if (activity == null) {
            promise.reject(E_CONTACTS_ERROR, "Activity doesn't exist")
            return
        }

        val permission = Manifest.permission.READ_CONTACTS
        val checkResult = ContextCompat.checkSelfPermission(activity, permission)

        if (checkResult == PackageManager.PERMISSION_GRANTED) {
            val result = Arguments.createMap().apply {
                putBoolean("granted", true)
                putBoolean("canAskAgain", true)
            }
            promise.resolve(result)
            return
        }

        permissionPromise = promise

        if (activity is PermissionAwareActivity) {
            activity.requestPermissions(
                arrayOf(permission),
                PERMISSION_REQUEST_CODE,
                this
            )
        } else {
            promise.reject(E_CONTACTS_ERROR, "Activity is not PermissionAwareActivity")
        }
    }

    @ReactMethod
    fun getContacts(promise: Promise) {
        val activity = currentActivity

        if (activity == null) {
            promise.reject(E_CONTACTS_ERROR, "Activity doesn't exist")
            return
        }

        val permission = Manifest.permission.READ_CONTACTS
        val checkResult = ContextCompat.checkSelfPermission(activity, permission)

        if (checkResult != PackageManager.PERMISSION_GRANTED) {
            promise.reject(E_PERMISSION_DENIED, "READ_CONTACTS permission not granted")
            return
        }

        try {
            val contacts = fetchContacts()
            promise.resolve(contacts)
        } catch (e: Exception) {
            promise.reject(E_CONTACTS_ERROR, "Error fetching contacts: ${e.message}")
        }
    }

    private fun fetchContacts(): WritableArray {
        val contactsList = Arguments.createArray()
        val contentResolver = reactApplicationContext.contentResolver
        val contactsMap = mutableMapOf<String, WritableMap>()

        val projection = arrayOf(
            ContactsContract.CommonDataKinds.Phone.CONTACT_ID,
            ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME,
            ContactsContract.CommonDataKinds.Phone.NUMBER
        )

        val cursor = contentResolver.query(
            ContactsContract.CommonDataKinds.Phone.CONTENT_URI,
            projection,
            null,
            null,
            ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME + " ASC"
        )

        cursor?.use {
            val idIndex = it.getColumnIndex(ContactsContract.CommonDataKinds.Phone.CONTACT_ID)
            val nameIndex = it.getColumnIndex(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME)
            val numberIndex = it.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER)

            while (it.moveToNext() && contactsMap.size < 100) {
                val contactId = it.getString(idIndex)
                val name = it.getString(nameIndex) ?: "Unknown"
                val phoneNumber = it.getString(numberIndex) ?: ""

                if (phoneNumber.isNotEmpty() && !contactsMap.containsKey(contactId)) {
                    val contact = Arguments.createMap().apply {
                        putString("id", contactId)
                        putString("name", name)
                        putString("phoneNumber", phoneNumber.replace(Regex("[^0-9+]"), ""))
                    }
                    contactsMap[contactId] = contact
                }
            }
        }

        contactsMap.values.forEach { contactsList.pushMap(it) }
        return contactsList
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>,
        grantResults: IntArray
    ): Boolean {
        if (requestCode == PERMISSION_REQUEST_CODE) {
            val activity = currentActivity
            val granted = grantResults.isNotEmpty() &&
                    grantResults[0] == PackageManager.PERMISSION_GRANTED

            val canAskAgain = if (activity != null && !granted) {
                activity.shouldShowRequestPermissionRationale(Manifest.permission.READ_CONTACTS)
            } else {
                true
            }

            val result = Arguments.createMap().apply {
                putBoolean("granted", granted)
                putBoolean("canAskAgain", canAskAgain)
            }

            permissionPromise?.resolve(result)
            permissionPromise = null
            return true
        }
        return false
    }
}
