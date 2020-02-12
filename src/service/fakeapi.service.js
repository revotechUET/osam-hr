module.exports.getUserInfo = (callback, errcallback) => {
    callback({
      orgUnitPath: "/",
      ipWhitelisted: false,
      creationTime: "2019-12-17T10:03:35.000Z",
      isMailboxSetup: true,
      isEnrolledIn2Sv: false,
      kind: "admin#directory#user",
      isAdmin: true,
      suspended: false,
      emails: [
        {
          address: "admin@i2g.cloud",
          primary: true
        }
      ],
      archived: false,
      lastLoginTime: "2020-02-05T07:11:02.000Z",
      isDelegatedAdmin: false,
      isEnforcedIn2Sv: false,
      changePasswordAtNextLogin: false,
      customerId: "C00gpcvio",
      name: {
        fullName: "I2G Admin",
        givenName: "I2G",
        familyName: "Admin"
      },
      etag: '"enlFCt4L0-k8PoIKzRNl5h_fsrc/lwRqSRv2jAx74KtlVlrWJ4ppUSo"',
      id: "117086874054885319634",
      primaryEmail: "admin@i2g.cloud",
      agreedToTerms: true,
      includeInGlobalAddressList: true
    });
};
