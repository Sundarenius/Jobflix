window.onload = function () {
  console.log('Page is finished loading')
  const businessBtn = document.querySelector('#businessBtn')
  const businessPage = document.querySelector('#business')
  const applicantsBtn = document.querySelector('#applicantsBtn')
  const applicantPage = document.querySelector('#applicants')
  const notificationsBtn = document.querySelector('#notificationsBtn')
  const notificationPage = document.querySelector('#notifications')
  const pricesBtn = document.querySelector('#pricesBtn')
  const pricesPage = document.querySelector('#prices')
  const navigationBtns = document.querySelectorAll('#navigationBtns h3')
  const notificationsSection = document.querySelector('#notificationsSection')
  const howManyNotifications = document.querySelector('#howManyNotifications')
  const howManyBusinesses = document.querySelector('#howManyBusinesses')
  const howManyApplicants = document.querySelector('#howManyApplicants')
  const totalGoldPackages = document.querySelector('#totalGoldPackages')
  const totalPlatinumPackages = document.querySelector('#totalPlatinumPackages')
  const totalPackages = document.querySelector('#totalPackages')
  const totalInSales = document.querySelector('#totalInSales')
  var latestInlogBusiness = []
  notificationsBtn.className = 'currentPage'

  businessBtn.addEventListener('click', showPage)
  applicantsBtn.addEventListener('click', showPage)
  notificationsBtn.addEventListener('click', showPage)
  pricesBtn.addEventListener('click', showPage)

  function showPage (e) {
    console.log('showPage triggerd')
    for (var i in navigationBtns) {
      console.log(navigationBtns[i].id)
      if (e.target.id === navigationBtns[i].id) {
        navigationBtns[i].className = 'currentPage'
      } else {
        navigationBtns[i].className = ''
      }
     }
    switch (e.target.id) {
      case 'notificationsBtn':
       businessPage.style.display = 'none'
       applicantPage.style.display = 'none'
       notificationPage.style.display = 'block'
       pricesPage.style.display = 'none'
       break
      case 'businessBtn':
        businessPage.style.display = 'block'
        applicantPage.style.display = 'none'
        notificationPage.style.display = 'none'
        pricesPage.style.display = 'none'
        break
      case 'applicantsBtn':
        businessPage.style.display = 'none'
        applicantPage.style.display = 'block'
        notificationPage.style.display = 'none'
        pricesPage.style.display = 'none'
        break
      case 'pricesBtn':
        businessPage.style.display = 'none'
        applicantPage.style.display = 'none'
        notificationPage.style.display = 'none'
        pricesPage.style.display = 'block'
        break
    }
  }

  function deleteNotification (e) {
    console.log('deleteNotification triggerd')
    console.log('ID för denna notifikation: ', e.target.name)
    const newArr = []
    firebase.database().ref('admin').child('notifications')
      .once('value', response => {
        const res = response.val()
        for (var i in res) {
          if (res[i].id !== e.target.name) {
            newArr.push(res[i])
          }
        }
        firebase.database().ref('admin').child('notifications')
          .set(newArr)
      })
    console.log(newArr)
    console.log(newArr.length)
  }

  function notificationSent (e) {
    console.log('notificationSent triggerd')
    console.log('ID för denna notifikation: ',e.target.name)
    var notCard = document.querySelectorAll('.notificationCard')
    for (var i = 0; i < notCard.length; i++) {
      if (notCard[i].id === e.target.name) {
        notCard[i].style.backgroundColor = '#ffeb3b'
      }
    }
  }

  function showUserInfo () {
    console.log('showUserInfo triggered')
    var corpCards = document.querySelectorAll('.hiddenCorpUserInfo')
    if (document.querySelector('.hiddenCorpUserInfo').style.display === '') {
      for (var i = 0; i < corpCards.length; i++) {
        corpCards[i].style.display = 'block'
      }
    } else {
      for (var i = 0; i < corpCards.length; i++) {
        corpCards[i].style.display = ''
      }
    }
    latestInlogBusiness.forEach(val => {
      var xx = val.latestInlog.replace(/-/g, '')
      var xxx = xx.replace(/ /g, '')
      var xxxx = xxx.replace(/:/g, '')
      console.log(xxxx)
      val.calculatedLastLogin = xxxx
    })
    latestInlogBusiness.sort((a, b) => {
      return b.calculatedLastLogin - a.calculatedLastLogin
    })
    console.log('Senaste inloggade företagen:')
    console.log(latestInlogBusiness)
  }

  function applicantClick () {
    console.log('applicantClick triggerd')
    var applicantClick = document.querySelectorAll('.extraApplicantInfo')
    if (document.querySelector('.extraApplicantInfo').style.display === '') {
      for (var i = 0; i < applicantClick.length; i++) {
        applicantClick[i].style.display = 'block'
      }
    } else {
      for (var i = 0; i < applicantClick.length; i++) {
        applicantClick[i].style.display = ''
      }
    }
  }

  // ********************************* Jobbsökare *********************************
  fetch('https://instawork-814df.firebaseio.com/applicants.json')
  .then(res => {
    return res.json()
  })
  .then(res => {
    console.log(res)
    howManyApplicants.innerHTML = ` Registrerade anv: <span class="howManyNotifications">${Object.keys(res).length - 1}</span>`
    for (var i in res) {
      if (res[i].profileInfo.hasOwnProperty('campaigns')) {
        var newApplicant = document.createElement('section')
        newApplicant.className = 'notificationCard applicantCard'
        newApplicant.innerHTML = `<h3 class="corpName">${res[i].profileInfo.profil.fullName}</h3>`
        newApplicant.innerHTML += `<h4>Inloggad: <span class="lastlogin">${res[i].profileInfo.lastLogIn}</span></h4>`
        newApplicant.innerHTML += `<h4>Registrerad: <span class="lastlogin">${res[i].profileInfo.registered}</span></h4>`
        newApplicant.innerHTML += `<h4>Presentationer: <span class="lastlogin">${Object.keys(res[i].profileInfo.campaigns).length - 1}</span></h4>`
        newApplicant.innerHTML += `
          <div class="extraApplicantInfo">
          <h5 style="padding-top:10px">Kommande möten: <span class="lastlogin">${Object.keys(res[i].profileInfo.events.appointments).length - 1}</span></h5>
          <h5>Förfrågningar: <span class="lastlogin">${res[i].profileInfo.events.requests.length - 1}</span></h5>
          <h5>Mail: <span class="lastlogin">${res[i].profileInfo.profil.email}</span></h5>
          <h5>Tel: <span class="lastlogin">${res[i].profileInfo.profil.phoneNr}</span></h5>
          </div>
          `
        applicantPage.appendChild(newApplicant)
      }
    }
    var applicantEl = document.querySelectorAll('.applicantCard')
    for (var x = 0; x < applicantEl.length; x++) {
      applicantEl[x].addEventListener('click', applicantClick)
    }
  })
  .catch(err => {
    console.log('Error with applicants: ', err)
  })

  // ********************************* BusinessAccounts *********************************
  var goldPackages = 0
  var platinumPackages = 0
  var totalInPackages = 0
  var totalInRevenue = 0
  fetch('https://instawork-814df.firebaseio.com/businessAccounts.json')
  .then(res => {
    return res.json()
  })
  .then(res => {
    console.log(res)
    howManyBusinesses.innerHTML = `: <span class="howManyNotifications">${Object.keys(res).length - 1}</span> registrerade företag`
    for (var i in res) {
      if (res[i].corpInfo.hasOwnProperty('businessLogo')) {
        var latestInlog = '0'
        console.log(res[i].corpInfo.businessName)
        var newCorp = document.createElement('article')
        newCorp.className = 'notificationCard'
        newCorp.innerHTML = `<h2 class="corpName corpCard">${res[i].corpInfo.businessName}</h2>`
        for (var ii in res[i].corpInfo.users) {
          if (res[i].corpInfo.users[ii].user.lastLogIn > latestInlog) {
            latestInlog = res[i].corpInfo.users[ii].user.lastLogIn
            var lastLogIn = {
              corp: res[i].corpInfo.businessName,
              latestInlog: res[i].corpInfo.users[ii].user.lastLogIn
            }
          }
        }
        latestInlogBusiness.push(lastLogIn)
        newCorp.innerHTML += `<h4>Senast inloggad: <span class="lastlogin lastloginbusiness">${latestInlog}</span></h4>
        <h4>Registrerat: <span class="lastlogin lastloginbusiness">${res[i].corpInfo.registered}</span></h4>
        `
        for (var ii in res[i].corpInfo.users) {
          newCorp.innerHTML += `<div class="userName corpCard">${res[i].corpInfo.users[ii].user.fullName}
          <span class="lastloginel">Inloggad: <span class="lastlogin">${res[i].corpInfo.users[ii].user.lastLogIn}</span></span>
          </div>
          <div class="hiddenCorpUserInfo">
            <h5>Mail: ${res[i].corpInfo.users[ii].user.email}</h5>
            <h5>Kommande möten: ${Object.keys(res[i].corpInfo.users[ii].user.events.appointments).length - 1}</h5>
            <h5>Bevakningar: ${Object.keys(res[i].corpInfo.users[ii].user.bevakningar).length - 1}</h5>
            <h5>Annonser: ${Object.keys(res[i].corpInfo.users[ii].user.ads).length - 1}</h5>
          </div>
          `
        }
        businessPage.appendChild(newCorp)
      }
      if (res[i].corpInfo.hasOwnProperty('pricePlan')) {
        if (res[i].corpInfo.pricePlan.package > 1) {
          var payingCustomer = document.createElement('article')
          payingCustomer.className = 'notificationCard pricePlanCard'
          if (res[i].corpInfo.pricePlan.package === 2) {
            goldPackages++
            totalInPackages++
            totalInRevenue = (Number(totalInRevenue) + Number(res[i].corpInfo.pricePlan.price))
            payingCustomer.innerHTML = `<div class="separatePackageAndName">
            <h2>${res[i].corpInfo.businessName}</h2><div class="goldPackage">GOLD</div>
            </div>`
            payingCustomer.innerHTML += `<div class="info">Pris: <span style="color:darkgreen">${res[i].corpInfo.pricePlan.price} SEK</span></div>`
          } else if (res[i].corpInfo.pricePlan.package === 3) {
            platinumPackages++
            totalInPackages++
            totalInRevenue = (Number(totalInRevenue) + Number(res[i].corpInfo.pricePlan.price))
            payingCustomer.innerHTML = `<div class="separatePackageAndName">
            <h2>${res[i].corpInfo.businessName}</h2><div class="platinumPackage">PLATINUM</div>
            </div>`
            payingCustomer.innerHTML += `<div class="info">Pris: <span style="color:darkgreen">${res[i].corpInfo.pricePlan.price} SEK</span></div>`
          }
          payingCustomer.innerHTML += `<div class="info">Startdatum: ${res[i].corpInfo.pricePlan.start}</div>`
          payingCustomer.innerHTML += `<div class="info">Adress: ${res[i].corpInfo.invoice.adress}</div>`
          payingCustomer.innerHTML += `<div class="info">Mail: ${res[i].corpInfo.invoice.mail}</div>`
          payingCustomer.innerHTML += `<div class="info">Tel: ${res[i].corpInfo.invoice.phoneNr}</div>`
          totalGoldPackages.innerHTML = `Antal Guld abonnemang: ${goldPackages}`
          totalPlatinumPackages.innerHTML = `Antal Platinum abonnemang: ${platinumPackages}`
          totalPackages.innerHTML = `Totalt antal abonnemang: ${totalInPackages}`
          totalInSales.innerHTML = `Oms. denna månad: <span style="color:darkgreen">${totalInRevenue}</span> SEK`
          if (new Date().toISOString().substr(0, 19).replace('T', ' ') < res[i].corpInfo.pricePlan.trialUntil) {
            payingCustomer.innerHTML += `<div class="trialText">Gratis t.o.m: <span class="trialDate">${res[i].corpInfo.pricePlan.trialUntil}</span></div>`
          }
  
          pricesPage.appendChild(payingCustomer)
        }
      }
    }
    var corpElement = document.querySelectorAll('.corpCard')
    for (var i = 0; i < corpElement.length; i++) {
      corpElement[i].addEventListener('click', showUserInfo)
    }
  })
  .catch(err => {
    console.log('Nåt blev fel me business: ', err)
  })

  // ********************************* Lyssna på notifikationer *********************************
  const accepted = {
    subject: 'du har ett nytt inbokat möte',
    msg: 'Du har fått en ny accepterad förfrågan, logga in för att få mer information.'
  }
  const newTime = {
    subject: 'du har fått en förfårgan om en ny tid',
    msg: 'Du har fått en förfrågan om en ny tid, logga in för att skicka en ny tid.'
  }
  const newTimeReq = {
    subject: 'du har fått nya tider skickade.',
    msg: 'Du har fått nya mötestider. Logga in för för mer information'
  }
  const newMsg = {
    subject: 'du har fått ett nytt meddelande',
    msg: 'Du har fått ett nytt meddelande. Logga in för att läsa meddelandet.'
  }
  const newInv = {
    subject: 'du har fått en ny mötesförfrågan.',
    msg: 'Du har fått en ny mötesförfågan skickad till dig. Logga in för mer information.'
  }
  firebase.database().ref('admin').child('notifications').on('value', response => {
    console.log('notificationsWatchFromFirebase triggered')
      const res = response.val()
      notificationsSection.innerHTML = 'Lyssnar på data (automatiskt uppdatering) ...'
      howManyNotifications.innerHTML = `: <span class="howManyNotifications">${Object.keys(res).length - 1}</span> nya notifikationer`
      for (var i in res) {
        let newArticle = document.createElement('article')
        console.log('Item:')
        if (res[i].hasOwnProperty('id')) {
          for (var ii in res[i]) {
            newArticle.innerHTML += `<div class="notificationProp">${[ii]}: 
            <span class="notificationContent">${res[i][ii]}</span>
            </div>`
          }
          newArticle.className = 'notificationCard notificationXXCard'
          newArticle.id = res[i].id
          var btnClass = `uniqueNotificationClass${new Date().getTime()}`
          var btnDoneClass = `uniqueDoneBtn${new Date().getTime()}`
          newArticle.innerHTML += `
          <div class="deleteNotificationBtn ${btnClass}">
          <button name="${res[i].id}">Ta bort!</button>
          </div>
          <div class="notificationSent ${btnDoneClass}">
          <button name="${res[i].id}">Markera färdig!</button>
          </div>
          `
          if (res[i].msg.includes('bett om en ny tid från din förfrågan')) {
            newArticle.innerHTML += `
            <div>
              <a class="sendEmail" href="mailto:${res[i].emailTo}?subject=${res[i].businessUser.split(' ')[0]}, ${newTime.subject}&body=${newTime.msg}">Skicka mail</a>
            </div>
            `
          } else if (res[i].msg.includes('har accepterat din förfrågan')) {
            newArticle.innerHTML += `
            <div>
              <a class="sendEmail" href="mailto:${res[i].emailTo}?subject=${res[i].businessUser.split(' ')[0]}, ${accepted.subject}&body=${accepted.msg}">Skicka mail</a>
            </div>
            `
          } else if (res[i].msg.includes('Du har fått ett nytt meddelande') && res[i].notificationTo === 'Privatperson') {
            newArticle.innerHTML += `
            <div>
              <a class="sendEmail" href="mailto:${res[i].mail}?subject=${res[i].name.split(' ')[0]}, ${newMsg.subject}&body=${newMsg.msg}">Skicka mail</a>
            </div>
            `
          } else if (res[i].msg.includes('Du har fått ett nytt meddelande') && res[i].notificationTo === 'Business') {
            newArticle.innerHTML += `
            <div>
              <a class="sendEmail" href="mailto:${res[i].emailTo}?subject=${res[i].businessUser.split(' ')[0]}, ${newMsg.subject}&body=${newMsg.msg}">Skicka mail</a>
            </div>
            `
          } else if (res[i].msg.includes('Privatperson har fått en ny tid')) {
            newArticle.innerHTML += `
            <div>
              <a class="sendEmail" href="mailto:${res[i].mail}?subject=${res[i].name.split(' ')[0]}, ${newTimeReq.subject}&body=${newTimeReq.msg}">Skicka mail</a>
            </div>
            `
          } else if (res[i].msg.includes('Privatperson har fått intervjuerbjudande')) {
            newArticle.innerHTML += `
            <div>
              <a class="sendEmail" href="mailto:${res[i].mail}?subject=${res[i].name.split(' ')[0]}, ${newInv.subject}&body=${newInv.msg}">Skicka mail</a>
            </div>
            `
          }
          notificationsSection.appendChild(newArticle)
          document.querySelector(`.${btnDoneClass}`).addEventListener('click', notificationSent)
          document.querySelector(`.${btnClass}`).addEventListener('click', deleteNotification)
        }
      }
  })
}