

#from twilio.rest import Client
from twilio.rest import TwilioRestClient

# Your Account SID from twilio.com/console
account_sid = "ACc9143c3c449e77243191e3f67a00dcd4"
# Your Auth Token from twilio.com/console
auth_token  = "62a7d6e59fc491290ae69c16427864e5"

client = TwilioRestClient(account_sid, auth_token)

message = client.messages.create(
    to="+918699511468", 
    from_="+16122845358",
    body="chutiye")

print(message.sid)

