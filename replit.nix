{ pkgs }: {
	deps = [
		pkgs.calc
  pkgs.openssh
    pkgs.inetutils
    pkgs.lsof
    pkgs.nodejs-18_x
    pkgs.nodePackages.typescript-language-server
    pkgs.yarn
    pkgs.replitPackages.jest
    pkgs.ncurses.dev
    pkgs.pkg-config
	];
}