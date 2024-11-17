const siteUrl = process.env.NODE_ENV === "development" ? "http://localhost:10111" : "https://allergy-navi.com";

export const verifyMailBody = (code: string): string => {
	return /* html */ `
		<p>アカウント作成ありがとうございます。</p>
		<p>下記リンクをクリックして、メール認証を完了してください。</p>
		<p>メール認証を完了することで各種機能が使用可能になります。</p>
		<p><a href="${siteUrl}/verified?code=${code}">メール認証を完了する</a></p>
		<p>※このリンクは7日後に使用できなくなります。</p>
		<p>※メール認証せずに7日過ぎるとアカウントが削除されるため、7日が過ぎた際は再度登録をお願いします。</p>
		<p>アレルギーナビ</p>
	`;
};

export const verifyMailTitle = "メール認証を完了してください。";

export const mailFrom = "アレルギーナビ<noreply@mail.allergy-navi.com>";

export const recoveryMailTitle = "メール認証を完了してください。";

export const recoveryMailBody = (code: string): string => {
	return /* html */ `
		<p>下記リンクをクリックして、パスワードを再設定してください。</p>
		<p><a href="${siteUrl}/recovery?code=${code}">パスワードを再設定する</a></p>
		<p>※このリンクは7日後に使用できなくなります。</p>
		<p>アレルギーナビ</p>
	`;
};
