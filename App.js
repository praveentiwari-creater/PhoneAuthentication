import React, { Component } from 'react'
import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  
} from 'react-native'
// import firebase from '@react-native-firebase/app';
// import firebase from 'react-native-firebase';
import auth from '@react-native-firebase/auth';
export default class App extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      phone: '',
      confirmResult: null,
      verificationCode: '',
      userId: '',
      OTP:[],
      varificationCode:null,
      sate:["5","6","7","8","9","0"],

      pin1:'',
      pin2:'',
      pin3:'',
      pin4:'',
      pin5:'',
      pin6:''
    }
  }

componentDidMount=()=>{
  this.refs.nameref1.focus()
}

  validatePhoneNumber = () => {
    var regexp = /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{8,16})$/
    return regexp.test(this.state.phone)
  }
  handleSendCode = () => {
    console.log('Testing')
    // Request to send OTP
    if (this.validatePhoneNumber()) {
      console.log('Testing')
      // firebase.
      // const confirmation = await auth().signInWithPhoneNumber(this.state.phone);
      //   this.setState({confirmResult:confirmation})
      //   console.log('Testing1==>',confirmation)
      auth().signInWithPhoneNumber(this.state.phone).then(confirmResult => {
        console.log('praveen', confirmResult)
        this.setState({ confirmResult })
        if (confirmResult) {
          // let rr=auth().checkActionCode();
          // alert(rr.toString());
          this.autoVerification();
        }
      })
        .catch(error => {
          alert(error.message)
          console.log(error)
        })
    } else {
      alert('Invalid Phone Number')
    }
    console.log('conferm result praveen', this.state.confirmResult)
  }

  autoVerification = () => {
    auth()
      .verifyPhoneNumber(this.state.phone)
      .on('state_changed', (phoneAuthSnapshot) => {
         console.log(JSON.stringify(phoneAuthSnapshot));
        switch (phoneAuthSnapshot.state) {

          case auth.PhoneAuthState.CODE_SENT: // or 'sent'
            alert('code sent')
            console.log('code sent');
            break;

          case auth.PhoneAuthState.ERROR: // or 'error'
            alert('verification error')
            console.log('verification error');
            console.log(phoneAuthSnapshot.error);
            break;

          case auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'

            alert('auto verify on android timed out')
            console.log('auto verify on android timed out');
            break;

          case auth.PhoneAuthState.AUTO_VERIFIED: // or 'verified'
            setTimeout(
              function () {
                alert('auto verified on android');
              }, 3000)
            console.log('auto verified on android');
            console.log(phoneAuthSnapshot);
            // const { verificationId, code } = phoneAuthSnapshot;
            let otp=phoneAuthSnapshot.code;
            let varify=phoneAuthSnapshot.verificationId
             this.setState({OTP:otp})
             this.setState({varificationCode:varify})
            // this.getCurrentUser(); // Checking if the user is logged-in and it have the user as current user.
            break;
        }
      }
        , (error) => {
          console.log(error);
          console.log(error.verificationId);
        }), (phoneAuthSnapshot) => {
         
          console.log(phoneAuthSnapshot);
        };
  }
  changePhoneNumber = () => {
    this.setState({ confirmResult: null, verificationCode: '' })
  }
  handleVerifyCode = () => {
    // Request for OTP verification
    const { confirmResult, verificationCode } = this.state
    if (verificationCode.length == 6) {
      confirmResult
        .confirm(verificationCode)
        .then(user => {
          this.setState({ userId: user.user.uid })
          console.log('varification praveen===>', user)
          console.log('varification user id', user.user.uid)
          alert(`Verified! ${user.user.uid}`)
        })
        .catch(error => {
          alert(error.message)
          console.log(error)
        })
    } else {
      alert('Please enter a 6 digit OTP code.')
    }
  }
  renderConfirmationCodeView = () => {
    return (
      <View style={styles.verificationView}>
        <TextInput
          style={styles.textInput}
          placeholder='Verification code'
          placeholderTextColor='red'
          value={this.state.OTP}
          keyboardType='numeric'
          onChangeText={verificationCode => {
            this.setState({ verificationCode })
          }}
          maxLength={6}
        />
        <TouchableOpacity
          style={[styles.themeButton, { marginTop: 20 }]}
          onPress={this.handleVerifyCode}>
          <Text style={styles.themeButtonTitle}>Verify Code</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#333' }]}>
        <View style={styles.page}>
          <TextInput
            style={styles.textInput}
            placeholder='Phone Number with country code'
            placeholderTextColor='#eee'
            keyboardType='phone-pad'
            value={this.state.phone}
            onChangeText={phone => {
              this.setState({ phone })
            }}
            maxLength={15}
            editable={this.state.confirmResult ? false : true}
          />

          <TouchableOpacity
            style={[styles.themeButton, { marginTop: 20 }]}
            onPress={
              this.state.confirmResult
                ? this.changePhoneNumber
                : this.handleSendCode
            }>
            <Text style={styles.themeButtonTitle}>
              {this.state.confirmResult ? 'Change Phone Number' : 'Send Code'}
            </Text>
          </TouchableOpacity>
          {/* <Text>{this.state.varificationCode}</Text> */}
          {this.state.confirmResult ? this.renderConfirmationCodeView() : null}

          
          <View style={{flexDirection:'row'}}>
            <TextInput style={styles.textinput}
            ref={"nameref1"}
            maxLength={1}
            onChangeText={(pin1)=>{this.setState({pin1:pin1})
              if(pin1 !=""){
                this.refs.nameref2.focus()
              }
            }}
           
            placeholderTextColor='#eee'
             value={this.state.OTP[0]}/>
            <TextInput  style={styles.textinput}
             ref={"nameref2"}
             maxLength={1}
             onChangeText={(pin2)=>{this.setState({pin2:pin2})
             if(pin2 !=""){
              this.refs.nameref3.focus()
            }
            }}
             placeholderTextColor='#eee' 
              value={this.state.OTP[1]}/>
            <TextInput  style={styles.textinput}
             ref={"nameref3"}
             maxLength={1}
             onChangeText={(pin3)=>{this.setState({pin3:pin3})
             if(pin3 !=""){
              this.refs.nameref4.focus()
            }
            }}
             placeholderTextColor='#eee'
               value={this.state.OTP[2]}/>
            <TextInput  style={styles.textinput}
             ref={"nameref4"}
             maxLength={1}
             onChangeText={(pin4)=>{this.setState({pin4:pin4})
             if(pin4 !=""){
              this.refs.nameref5.focus()
            }
            }}
             placeholderTextColor='#eee'
               value={this.state.OTP[3]}/>
            <TextInput  style={styles.textinput}
             ref={"nameref5"}
             maxLength={1}
             onChangeText={(pin5)=>{this.setState({pin5:pin5})
             if(pin5 !=""){
              this.refs.nameref6.focus()
            }
            }}
              placeholderTextColor='#eee'
               value={this.state.OTP[4]}/>
            <TextInput  style={styles.textinput}
             ref={"nameref6"}
             maxLength={1}
             onChangeText={(pin6)=>{this.setState({pin6:pin6})
             if(pin6 !=""){
             alert("Thanks")
            }
            }}
             
            //  onChangeText={(otp6)=>this.setState({OTP[5]:otp6})}
             placeholderTextColor='#eee' 
              value={this.state.OTP[5]}/>
    
          </View>
        
        </View>

      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#aaa'
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textInput: {
    marginTop: 20,
    width: '90%',
    height: 40,
    borderColor: '#555',
    borderWidth: 2,
    borderRadius: 5,
    paddingLeft: 10,
    color: '#fff',
    fontSize: 16
  },
  themeButton: {
    width: '90%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#888',
    borderColor: '#555',
    borderWidth: 2,
    borderRadius: 5
  },
  themeButtonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red'
  },
  verificationView: {
    width: '100%',
    alignItems: 'center',
    marginTop: 50
  },
  textinput:{
    width:40,
    height:40,
    borderWidth:1,
    borderColor:'blue',
    marginTop:4,
    marginLeft:10,
    marginTop:20,
    color:'red',
    fontSize:18,
    textAlign:'center',
    borderRadius:7
  }
})