d-dialog
========

![image](https://cloud.githubusercontent.com/assets/433707/5057576/d54cf57e-6cd0-11e4-94b5-200f02542518.png)

```
npm i d-dialog --save
```

##Usage

```html
  <d-dialog as="loginDialog">
    <h2>{{t('login')}}</h2>
    <form class="pure-form pure-form-stacked" method="post" action="/login" data-router-ignore="">
      <fieldset class="pure-u-1-1">
        <div class="pure-control-group left">
          <label for="email">{{t('Username')}}</label>
          <input tabindex="1" class="pure-input-1" autofocus id="email" type="text" name="username">
        </div>
        <div class="pure-control-group left">
          <label for="password">{{t('Password')}}<a data-router-ignore="" class="pull-right smaller italic gray margin-top-7 t" href="/password-reset">{{t('Need password remainder?')}}</a></label>
          <input tabindex="2" class="pure-input-1" id="password" type="password" name="password">
        </div>
        <div class="pure-control-group center">
          <button tabindex="3" type="submit" class="pure-button pure-button-primary pure-button-wide"><i class="fa fa-sign-in"></i> {{t('Sign in')}}</button>
        </div>
      </fieldset>
    </form>
    <hr class="fancy-line with-label" data-label="{{t('or')}}">
    <p>{{t('Sign in with')}} <a data-router-ignore="" href="/auth/facebook" class="blanket-button blanket-button-bright bg-fb"><i class="fa fa-facebook"></i></a> <a data-router-ignore="" href="/auth/twitter" class="blanket-button blanket-button-bright bg-twitter"><i class="fa fa-twitter"></i></a></p>
    <hr class="fancy-line with-label" data-label="{{t('or')}}">
    <p class="center"><a class="pure-button pure-button-success" data-router-ignore="" href="/register"><i class="fa fa-plus-circle"></i> {{t('Sign up')}}</a></p>
  </d-dialog>
```


```html
<a data-router-ignore="" href="/login" on-click="loginDialog.show($event)"><span>{{t('login')}}</span></a>
```
