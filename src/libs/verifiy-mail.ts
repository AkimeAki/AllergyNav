const siteUrl = process.env.NODE_ENV === "development" ? "http://localhost:10111" : "https://allergy-navi.com";

export const mailBody = (code: string): string => {
	return /* html */ `
		<p>アカウント作成ありがとうございます。</p>
		<p>下記リンクをクリックして、メール認証を完了してください。</p>
		<p>メール認証を完了することで各種機能が使用可能になります。</p>
		<p><a href="${siteUrl}/verified?code=${code}">メール認証を完了する</a></p>
		<p>※このリンクは7日後に使用できなくなります。</p>
		<p>※メール認証せずに7日過ぎるとアカウントが削除されるため、再度登録をお願いします。</p>
		<p>アレルギーナビ</p>
	`;
};

export const mailTitle = "メール認証を完了してください。";

export const mailFrom = "アレルギーナビ<noreply@mail.allergy-navi.com>";
