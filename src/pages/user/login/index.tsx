import { Alert, Checkbox } from 'antd';
import React, { Component } from 'react';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Dispatch, AnyAction } from 'redux';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import {Input,Button} from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import { StateType } from '@/models/login';
import LoginComponents from './components/Login';
import { LoginParamsType } from '@/services/login';
import { ConnectState } from '@/models/connect';
import LoginLogo from './loginLogo.png'
import styles from './index.less';
let loginObj = null;
const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginComponents;
interface LoginProps {
  dispatch: Dispatch<AnyAction>;
  userLogin: StateType;
  submitting?: boolean;
}
interface LoginState {
  type: string;
  autoLogin: boolean;
  loginTypes: number;
  qrLogin: boolean;
  checkTime: string;
  canGetCheck: boolean;
  username: string;
  password: string;
  mobile: string;
  checkNum: string;
  loginLoading: boolean;
}

class Login extends Component<LoginProps, LoginState> {
  loginForm: FormComponentProps['form'] | undefined | null = undefined;

  state: LoginState = {
    type: 'account',
    autoLogin: true,
    loginTypes: 1,
    qrLogin: false,
    checkTime: '获取验证码',
    canGetCheck: true,
    username: '',
    password: '',
    mobile: '',
    checkNum: '', 
    loginLoading: false,
  };
  componentDidMount () {
   
  }
  changeType = (loginTypes:any) => {
    this.setState({
      loginTypes
    })
  }
  changeAutoLogin = (e: CheckboxChangeEvent) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  handleSubmit = () => {
    const { type } = this.state;
    const {username,password} = this.state;
    const params = {
      mobile:username,
      pwd:password
    } 
    console.log(params);
    const { dispatch } = this.props;
    dispatch({
      type: 'login/login',
      payload: { ...params, type },
    });
  };

  onTabChange = (type: string) => {
    this.setState({
      type,
    });
  };

  onGetCaptcha = () =>
    new Promise<boolean>((resolve, reject) => {
      if (!this.loginForm) {
        return;
      }

      this.loginForm.validateFields(
        ['mobile'],
        {},
        async (err: unknown, values: LoginParamsType) => {
          if (err) {
            reject(err);
          } else {
            const { dispatch } = this.props;

            try {
              const success = await ((dispatch({
                type: 'login/getCaptcha',
                payload: values.mobile,
              }) as unknown) as Promise<unknown>);
              resolve(!!success);
            } catch (error) {
              reject(error);
            }
          }
        },
      );
    });

  renderMessage = (content: string) => (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );

  render() {
    const { userLogin = {}, submitting } = this.props;
    const { status, type: loginType } = userLogin;
    const { type, autoLogin } = this.state;
    const {
      loginTypes, qrLogin, checkTime,
      mobile, loginLoading,
      canGetCheck
    } = this.state;
    return (
      <div className={styles.logins+' center_flex'}>
        <div className={styles.login_title}>
          <div>
            {/* <img src={require("./comp_logo.png")} alt=""/> */}
            <span className={styles.topTitle}>
              趁年轻公证
            </span>
            
          </div>
          <p className={styles.pbottom}>后台管理系统</p>
          <span className={styles.bottomSpan}>CNQ</span>
        </div>
        <div className={styles.login_container+' center_flex'}>
          <div
            onClick={() => this.setState({ qrLogin: !qrLogin })}
            className={styles.change_login_type}>
          </div>
          <div style={{ display: qrLogin ? 'none' : 'block' }} className={styles.login_phone}>
            <div className={styles.code_login}>
              账号密码登录
            </div>
            <div className={styles.input_msg}>
                <Input
                  onChange={e => this.setState({ username: e.target.value })} placeholder='请输入账号' />
                <Input
                  onChange={e => this.setState({ password: e.target.value })} type='password' placeholder='请输入密码' />
            </div>
            {/* <div className={styles.auto_login}>
              <div className={styles.select_auto_login+'  between_flex'} style={{marginLeft:'3px'}}>
                <Checkbox>
                  <span className="auto_login_text">
                    5天内自动登录
                </span>
                </Checkbox>
                <span className="forgot_password">
                  忘记密码
                </span>
              </div>
            </div> */}

            <Button
              onClick={this.handleSubmit}
              className={styles.login_btn}>
              登录
            </Button>
          </div>

          <div
            style={{ display: !qrLogin ? 'none' : 'block' }}
            className={styles.login_right_qrcode}>
            <div className={styles.wechat_login}>
              微信扫码登录
           </div>
            <div className={styles.qr_code} id="qr_code">
              
            </div>
          </div>
        </div>
        <div className="Copyright">
          <div>
            Copyright © 2020-2022 趁年轻知识产权代理（北京）有限公司 | <a href="https://www.ermaisoft.com/">ermaisoft.com</a> | <a target="_blank" href="http://beian.miit.gov.cn/state/outPortal/loginPortal.action;jsessionid=e-hrAzhVBwMj9AiATNu_GbL5A5vKk9O3uKERx74WThdCnLWMXXEo!1958385134">京ICP备19054936号-3</a>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);

// window.onhashchange = ()=>{
//   console.log(1234);
// }