from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth.models import User
from django import forms

# If you don't do this you cannot use Bootstrap CSS
class LoginForm(AuthenticationForm):
    username = forms.CharField(label="Username", max_length=30, 
                               widget=forms.TextInput(attrs={'name': 'username', 'placeholder': 'Username'}))
    password = forms.CharField(label="Password", max_length=30, 
                               widget=forms.PasswordInput(attrs={'name': 'password', 'placeholder': 'Password'}))

class RegistrationForm(UserCreationForm):
    username = forms.RegexField(regex=r'^\w+$', label="Username", max_length=30, required=True,
                                widget=forms.TextInput(attrs={'name': 'username', 'placeholder': 'Username'}),
                                error_messages={'invalid': "Username must contain only letters, numbers and underscores." })
    email = forms.EmailField(label="Email address", required=True, max_length=30,
                            widget=forms.TextInput(attrs={'name': 'email', 'placeholder': 'Email Address', 'type': 'email'}))
    password1 = forms.CharField(label="Password", max_length=30, required=True,
                                widget=forms.PasswordInput(attrs={'name': 'password1', 'placeholder': 'Password'}))
    password2 = forms.CharField(label="Password", max_length=30, required=True,
                                widget=forms.PasswordInput(attrs={'name': 'password2', 'placeholder': 'Confirm password'}))

    def clean_username(self):
        try:
            user = User.objects.get(username__iexact=self.cleaned_data['username'])
        except User.DoesNotExist:
            return self.cleaned_data['username']
        raise forms.ValidationError("The username already exists. Please try another one.")
 
    def clean(self):
        if 'password1' in self.cleaned_data and 'password2' in self.cleaned_data:
            if self.cleaned_data['password1'] != self.cleaned_data['password2']:
                raise forms.ValidationError("The two password fields did not match.")
        return self.cleaned_data                                

    # class Meta:
    #     model = User
    #     fields = ("username", "password1", "password2")

    # def save(self, commit=True):
    #     user = super(SignupForm, self).save(commit=False)
    #     if commit:
    #         user.save()
    #     return user