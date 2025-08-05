# back11ecom

`get cookie`

```js
const token = req.cookies.authToken;
```

`set cookie`

```js
res.cookie("authToken", token, {
  httpOnly: true,
  maxAge: 60 * 60 * 5 * 1000,
});
```

`delete cookie`

```js
res.clearCookie("authToken", {
  httpOnly: true,
  maxAge: 60 * 60 * 5 * 1000,
});
```
