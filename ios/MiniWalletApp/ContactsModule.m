#import "ContactsModule.h"
#import <Contacts/Contacts.h>

@implementation ContactsModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(requestPermission:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  CNContactStore *store = [[CNContactStore alloc] init];
  
  CNAuthorizationStatus status = [CNContactStore authorizationStatusForEntityType:CNEntityTypeContacts];
  
  if (status == CNAuthorizationStatusAuthorized) {
    resolve(@{
      @"granted": @YES,
      @"canAskAgain": @YES
    });
    return;
  }
  
  [store requestAccessForEntityType:CNEntityTypeContacts completionHandler:^(BOOL granted, NSError * _Nullable error) {
    if (error) {
      reject(@"E_CONTACTS_ERROR", @"Error requesting permission", error);
      return;
    }
    
    resolve(@{
      @"granted": @(granted),
      @"canAskAgain": @YES
    });
  }];
}

RCT_EXPORT_METHOD(getContacts:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  CNContactStore *store = [[CNContactStore alloc] init];
  
  CNAuthorizationStatus status = [CNContactStore authorizationStatusForEntityType:CNEntityTypeContacts];
  
  if (status != CNAuthorizationStatusAuthorized) {
    reject(@"E_PERMISSION_DENIED", @"READ_CONTACTS permission not granted", nil);
    return;
  }
  
  NSArray *keys = @[CNContactGivenNameKey, CNContactFamilyNameKey, CNContactPhoneNumbersKey];
  CNContactFetchRequest *request = [[CNContactFetchRequest alloc] initWithKeysToFetch:keys];
  
  NSMutableArray *contactsArray = [NSMutableArray array];
  NSMutableSet *addedIds = [NSMutableSet set];
  
  NSError *error = nil;
  [store enumerateContactsWithFetchRequest:request error:&error usingBlock:^(CNContact * _Nonnull contact, BOOL * _Nonnull stop) {
    if (contactsArray.count >= 100) {
      *stop = YES;
      return;
    }
    
    if (contact.phoneNumbers.count > 0) {
      NSString *contactId = contact.identifier;
      
      if ([addedIds containsObject:contactId]) {
        return;
      }
      
      [addedIds addObject:contactId];
      
      NSString *firstName = contact.givenName ?: @"";
      NSString *lastName = contact.familyName ?: @"";
      NSString *fullName = [[NSString stringWithFormat:@"%@ %@", firstName, lastName] stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]];
      
      if (fullName.length == 0) {
        fullName = @"Unknown";
      }
      
      CNPhoneNumber *phoneNumber = contact.phoneNumbers.firstObject.value;
      NSString *phoneString = phoneNumber.stringValue;
      
      NSString *cleanedPhone = [[phoneString componentsSeparatedByCharactersInSet:
                                [[NSCharacterSet characterSetWithCharactersInString:@"0123456789+"] invertedSet]]
                               componentsJoinedByString:@""];
      
      if (cleanedPhone.length > 0) {
        NSDictionary *contactDict = @{
          @"id": contactId,
          @"name": fullName,
          @"phoneNumber": cleanedPhone
        };
        
        [contactsArray addObject:contactDict];
      }
    }
  }];
  
  if (error) {
    reject(@"E_CONTACTS_ERROR", [NSString stringWithFormat:@"Error fetching contacts: %@", error.localizedDescription], error);
    return;
  }
  
  resolve(contactsArray);
}

@end
